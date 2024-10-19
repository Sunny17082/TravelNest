import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { loadStripe } from "@stripe/stripe-js";

const BookingOption = ({ place }) => {
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [numberOfGuests, setNumberOfGuests] = useState(1);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [redirect, setRedirect] = useState("");
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (user) {
			setName(user.name);
		}
	}, [user]);

	let numberOfDays = 0;
	if (checkIn && checkOut) {
		if (new Date(checkIn) > new Date(checkOut)) {
			alert("Check-out date must be after check-in date");
			setCheckOut("");
		}
		if (new Date(checkIn) < new Date()) {
			alert("Check-in date must be after today");
			setCheckIn("");
		}
		numberOfDays = differenceInCalendarDays(
			new Date(checkOut),
			new Date(checkIn)
		);
	}

	const makePayment = async () => {
		if (!user) {
			alert("Please login to book this place");
			return;
		}
		if (numberOfDays <= 0 || numberOfDays === 0) {
			alert("Please select valid dates");
			return;
		}
		if (!name || !phone) {
			alert("Please enter your name and phone");
			return;
		}

		const stripe = await loadStripe(
			"pk_test_51PXNSJRua2fNuy2GVPYspgKS67PUSpmYDUmoy7edHIY1oy3wdYTmdpwEUOHpVjk6W9PIJEIQDtzSFIQF5ztX8SFK00xGBIzivc"
		);

		const response = await axios.post("/create-checkout-session", {
			checkIn,
			checkOut,
			numberOfGuests,
			name,
			phone,
			place: place._id,
			price: numberOfDays * place.price,
		});

		const session = response.data;

		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			alert(result.error.message);
		};
	}

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<>
			<div className=" h-min bg-white p-4 rounded-2xl shadow">
				<div className="text-2xl text-center font-semibold">
					Price: ₹{place.price}/night
				</div>
				<div className="border rounded-2xl m-4">
					<div className="flex">
						<div className="px-3 py-4">
							<label>Check-in</label>
							<input
								type="date"
								required
								value={checkIn}
								onChange={(ev) => setCheckIn(ev.target.value)}
							/>
						</div>
						<div className="px-3 py-4 border-l">
							<label>Check-out</label>
							<input
								type="date"
								required
								value={checkOut}
								onChange={(ev) => setCheckOut(ev.target.value)}
							/>
						</div>
					</div>
					<div className="px-3 py-4 border-t">
						<label>Number of Guests</label>
						<input
							type="number"
							value={numberOfGuests}
							onChange={(ev) =>
								setNumberOfGuests(ev.target.value)
							}
						/>
					</div>
					{numberOfDays > 0 && (
						<>
							<div className="px-3 py-4 border-t">
								<label>Your Full name</label>
								<input
									type="text"
									placeholder="your name"
									required
									value={name}
									onChange={(ev) => setName(ev.target.value)}
								/>
							</div>
							<div className="px-3 py-4 border-t">
								<label>Phone Number</label>
								<input
									type="tel"
									placeholder="+91 1234567890"
									required
									value={phone}
									onChange={(ev) => setPhone(ev.target.value)}
								/>
							</div>
						</>
					)}
				</div>
				<button onClick={makePayment} className="primary">
					Book now &nbsp;
					{numberOfDays > 0 && (
						<span>₹{numberOfDays * place.price}</span>
					)}
				</button>
			</div>
		</>
	);
};

export default BookingOption;
