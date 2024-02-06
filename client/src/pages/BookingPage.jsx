import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceGallery from "../components/PlaceGallery";
import PlaceAddress from "../components/PlaceAddress";
import BookingDates from "../components/BookingDates";

const BookingPage = () => {
	const { id } = useParams();
	const [booking, setBooking] = useState(null);

	useEffect(() => {
		axios.get("/bookings").then((response) => {
			const foundBooking = response.data.find(({ _id }) => _id === id);
			if (foundBooking) {
				setBooking(foundBooking);
			}
		});
	}, [id]);

	if (!booking) {
		return "";
	}

	return (
		<div className="my-8">
			<h1 className="text-3xl">{booking.place.title}</h1>
			<PlaceAddress place={booking.place} />
			<div className="bg-gray-200 p-6 my-6 rounded-2xl flex justify-between items-center">
				<div>
					<h2 className="text-xl">Your booking information</h2>
					<BookingDates booking={booking} />
				</div>
				<div className="bg-primary p-6 text-white rounded-2xl cursor-pointer">
					<div>Total Price</div>
					<div className="text-xl"> ₹{booking.price}</div>
				</div>
			</div>
			<PlaceGallery place={booking.place} />
		</div>
	);
};

export default BookingPage;
