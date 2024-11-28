const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const download = require("image-downloader");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const multer = require("multer");
const User = require("./models/user");
const Place = require("./models/place");
const Booking = require("./models/booking");
const Review = require("./models/review");
const Order = require("./models/order");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const app = express();

const PORT = process.env.PORT;

// generating salt after 10 iteration
const bcryptSalt = bcrypt.genSaltSync(10);

const secret = process.env.SECRET;

app.use("/webhook", express.raw({ type: "application/json" }));

// parse incoming requests with JSON payloads
app.use(express.json());

// parses cookies attached to the client's request and makes them available in the req.cookies object.
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

//  It allows requests from http://localhost:5173 to access the server, including credentials in the requests
app.use(
	cors({
		credentials: true,
		origin: process.env.FRONTEND_URL,
	})
);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("Connection successful..."))
	.catch((err) => console.log(err));

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

function getUserDataFromReq(req) {
	return new Promise((resolve, reject) => {
		jwt.verify(req.cookies.token, secret, {}, async (err, userData) => {
			if (err) throw err;
			resolve(userData);
		});
	});
}

app.post("/api/register", async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const userDoc = await User.create({
			name,
			email,
			// This function takes the plaintext password and the generated salt (bcryptSalt) and produces a securely hashed version of the password
			password: bcrypt.hashSync(password, bcryptSalt),
		});
		res.json(userDoc);
	} catch (err) {
		res.status(422).json(err);
	}
});

app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	const userDoc = await User.findOne({
		email,
	});
	if (userDoc) {
		// synchronously compare a plaintext password with a stored hashed password
		const passOk = bcrypt.compareSync(password, userDoc.password);
		if (passOk) {
			// generate a JWT and then setting it as a cookie in a response.
			jwt.sign(
				{ email: userDoc.email, id: userDoc._id }, // Payload
				secret, // Secret key for signing the token
				{}, // Options
				(err, token) => {
					// Callback function
					if (err) throw err;
					res.cookie("token", token).json(userDoc);
				}
			);
		} else {
			res.status(422).json("Password not ok");
		}
	} else {
		res.status(404).json("not found");
	}
});

app.get("/api/profile", (req, res) => {
	const { token } = req.cookies;
	if (token) {
		// to verify the token and send user data to client
		jwt.verify(token, secret, {}, async (err, userData) => {
			if (err) throw err;
			const { name, email, _id } = await User.findById(userData.id);
			res.json({ name, email, _id });
		});
	} else {
		res.json(null);
	}
});

app.post("/api/logout", (req, res) => {
	res.cookie("token", "").json(true);
});

async function uploadToCloudinary(path, originalFilename) {
	const parts = originalFilename.split(".");
	const ext = parts[parts.length - 1];
	const newFileName = Date.now() + "." + ext;
	const filePath = await cloudinary.uploader.upload(
		path,
		function (error, result) {
			console.log(result);
		}
	);
	return filePath.secure_url;
}

app.post("/api/upload-by-link", async (req, res) => {
	const { link } = req.body;

	const newName = "img" + Date.now() + ".png";
	const options = {
		url: link,
		dest: "/tmp/" + newName,
	};
	try {
		await download.image(options);
		const url = await uploadToCloudinary("/tmp/" + newName, newName);
		res.json(url);
	} catch (err) {
		console.log(err);
	}
});

const photosMiddleware = multer({ dest: "/tmp" });

app.post("/api/upload", photosMiddleware.array("photos", 100), async (req, res) => {
		const uploadedFiles = [];
		for (let i = 0; i < req.files.length; i++) {
			const { path, originalname } = req.files[i];
			// const parts = originalname.split("/");
			// const ext = parts[parts.length - 1];
			// const newPath = path + "." + ext;
			// fs.renameSync(path, newPath);
			// uploadedFiles.push(newPath.replace("uploads", ""));
			const url = await uploadToCloudinary(path, originalname);
			uploadedFiles.push(url);
		}
		res.json(uploadedFiles);
	}
);

app.post("/api/create-checkout-session", async (req, res) => {
	try {
		await mongoose.connect(process.env.MONGO_URI);

		const { price, place, checkIn, checkOut, numberOfGuests, name, phone } =
			req.body;
		const userData = await getUserDataFromReq(req);

		// Create a pending booking
		const booking = await Booking.create({
			place,
			checkIn,
			checkOut,
			numberOfGuests,
			name,
			phone,
			user: userData.id,
			price,
			paymentStatus: "pending",
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "inr",
						product_data: {
							name: "Booking",
						},
						unit_amount: price * 100,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${process.env.FRONTEND_URL}/account/bookings/${booking._id}`,
			cancel_url: `${process.env.FRONTEND_URL}/account/bookings/${booking._id}`,
			metadata: {
				bookingId: booking._id.toString(),
			},
		});

		// Update the booking with the Stripe session ID
		await Booking.findByIdAndUpdate(booking._id, { bookingId: session.id });

		res.json({ id: session.id, url: session.url });
	} catch (err) {
		console.error("Error creating checkout session:", err);
		res.status(500).json({ error: "Failed to create checkout session" });
	}
});

// Webhook endpoint
app.post(
	"/webhook",
	async (req, res) => {
		console.log("Webhook received");
		const sig = req.headers["stripe-signature"];
		let event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				sig,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.error(
				"Webhook signature verification failed:",
				err.message
			);
			return res.sendStatus(400);
		}

		console.log('Webhook verified successfully. Event type:', event.type);

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;
			const bookingId = session.metadata.bookingId;

			try {
				await Booking.findByIdAndUpdate(bookingId, {
					paymentStatus: "completed",
				});
				console.log("Booking updated to completed");
				res.json({ received: true });
			} catch (err) {
				console.error("Error updating booking:", err);
				res.status(500).json({ error: "Failed to update booking" });
			}
		} else if (event.type === "checkout.session.expired") {
			const session = event.data.object;

			try {
				await mongoose.connect(process.env.MONGO_URI);

				await Booking.findOneAndUpdate(
					{ bookingId: session.id },
					{ paymentStatus: "failed" }
				);

				console.log("Booking updated to failed");
				res.json({ received: true });
			} catch (err) {
				console.error("Error updating booking:", err);
				res.status(500).json({ error: "Failed to update booking" });
			}
		} else {
			res.json({ received: true });
		}
	}
);

// Endpoint to get a single booking
app.get("/api/bookings/:id", async (req, res) => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		const booking = await Booking.findById(req.params.id).populate("place");
		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}
		res.json(booking);
	} catch (err) {
		console.error("Error fetching booking:", err);
		res.status(500).json({ error: "Failed to fetch booking" });
	}
});

app.post("/api/places", (req, res) => {
	const { token } = req.cookies;
	const {
		title,
		address,
		addedPhotos,
		description,
		perks,
		extraInfo,
		checkIn,
		checkOut,
		maxGuests,
		price,
		tags
	} = req.body;

	jwt.verify(token, secret, {}, async (err, userData) => {
		if (err) throw err;
		const placeDoc = await Place.create({
			owner: userData.id,
			title,
			address,
			photos: addedPhotos,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
			price,
			tags
		});
		res.json(placeDoc);
	});
});

app.get("/api/user-places", (req, res) => {
	const { token } = req.cookies;

	jwt.verify(token, secret, {}, async (err, userData) => {
		if (err) throw err;
		const { id } = userData;
		res.json(await Place.find({ owner: id }));
	});
});

app.get("/api/places/:id", async (req, res) => {
	const { id } = req.params;
	res.json(await Place.findById(id));
});

app.put("/api/places", (req, res) => {
	const { token } = req.cookies;
	const {
		id,
		title,
		address,
		addedPhotos,
		description,
		perks,
		extraInfo,
		checkIn,
		checkOut,
		maxGuests,
		price,
		tags
	} = req.body;

	jwt.verify(token, secret, {}, async (err, userData) => {
		if (err) throw err;
		const placeDoc = await Place.findById(id);
		if (userData.id === placeDoc.owner.toString()) {
			placeDoc.set({
				title,
				address,
				photos: addedPhotos,
				description,
				perks,
				extraInfo,
				checkIn,
				checkOut,
				maxGuests,
				price,
				tags
			});
			await placeDoc.save();
			res.json(placeDoc);
		}
	});
});

app.delete("/api/place/:id", async (req, res) => {	
	try {
		const { token } = req.cookies;
		const { id } = req.params;

		jwt.verify(token, secret, {}, async (err, userData) => {
			if (err) throw err;
			const placeDoc = await Place.findByIdAndDelete(id);
			res.json(placeDoc);
		});
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
})

app.get("/api/places", async (req, res) => {
	try {
		const { search, sort, minPrice, maxPrice } = req.query;
		let query = {};
		let sortOption = {};

		// Search functionality
		if (search) {
			query = {
				$or: [
					{ title: { $regex: search, $options: "i" } },
					{ address: { $regex: search, $options: "i" } },
					{ tags: { $in: [new RegExp(search, "i")] } },
				],
			};
		}

		// Price range filter
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = parseInt(minPrice);
			if (maxPrice) query.price.$lte = parseInt(maxPrice);
		}

		// Sorting
		if (sort === "asc") {
			sortOption = { price: 1 };
		} else if (sort === "desc") {
			sortOption = { price: -1 };
		}

		const places = await Place.find(query).sort({ createdAt: -1, ...sortOption });
		res.json(places);
	} catch (error) {
		console.error("Error fetching places:", error);
		res.status(500).json({ message: "Error fetching places" });
	}
});

app.get("/api/place/:id", async (req, res) => {
	const { id } = req.params;
	res.json(await Place.findById(id));
});

app.post("/api/bookings", async (req, res) => {
	const userData = await getUserDataFromReq(req);
	const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
		req.body;
	Booking.create({
		place,
		checkIn,
		checkOut,
		numberOfGuests,
		name,
		phone,
		price,
		user: userData.id,
	})
		.then((doc) => {
			res.status(200).json(doc);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

app.get("/api/bookings", async (req, res) => {
	const userData = await getUserDataFromReq(req);
	res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.get("/api/reviews/:placeId", async (req, res) => {
	try {
		const { placeId } = req.params;
		const reviews = await Review.find({ place: placeId }).populate(
			"user",
			"name"
		);
		res.json(reviews);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching reviews",
			error: error.message,
		});
	}
});

app.post("/api/reviews/:placeId", async (req, res) => {
	try {
		const { placeId } = req.params;
		const { rating, comment } = req.body;
		const user = await getUserDataFromReq(req);

		console.log(user);

		const newReview = await Review.create({
			place: placeId,
			rating,
			comment,
			user: user.id,
		});

		const place = await Place.findById(placeId);
		const reviews = await Review.find({ place: placeId });
		const totalRating = reviews.reduce(
			(sum, review) => sum + review.rating,
			0
		);
		place.rating = totalRating / reviews.length;
		await place.save();

		res.status(201).json(newReview);
	} catch (error) {
		res.status(500).json({
			message: "Error creating review",
			error: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log("Server started on port 5000...");
});
