const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const app = express();

const PORT = process.env.PORT;

// generating salt after 10 iteration
const bcryptSalt = bcrypt.genSaltSync(10);

const secret = process.env.SECRET;

// parse incoming requests with JSON payloads
app.use(express.json());

// parses cookies attached to the client's request and makes them available in the req.cookies object.
app.use(cookieParser());

//  It allows requests from http://localhost:5173 to access the server, including credentials in the requests
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:5173",
	})
);

// connecting the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connection successful..."))
    .catch((err) => console.log(err));

app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({
        email
    });
    if (userDoc) {
        // synchronously compare a plaintext password with a stored hashed password
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            // generate a JWT and then setting it as a cookie in a response.
            jwt.sign(
                { email: userDoc.email, id: userDoc._id}, // Payload
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

app.get("/profile", (req, res) => {
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

app.listen(PORT, () => {
    console.log("Server started on port 5000...");
});