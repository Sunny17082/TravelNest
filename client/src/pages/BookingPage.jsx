import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, differenceInCalendarDays } from "date-fns";
import PlaceGallery from "../components/PlaceGallery";

const BookingPage = () => {
	const { id } = useParams();
	const [booking, setBooking] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		if (!id) return;

		const loadBooking = async () => {
			try {
				const response = await axios.get(`/bookings/${id}`);
				if (response.data) {
					setBooking(response.data);
				}
			} catch (error) {
				console.error("Failed to load booking:", error);
				if (error.response && error.response.status === 404) {
					navigate("/account/bookings"); // Redirect to bookings list if not found
				}
			} finally {
				setLoading(false);
			}
		};

		loadBooking();
	}, [id, navigate]);

	const handlePayment = async () => {
		try {
			const response = await axios.post("/create-checkout-session", {
				price: booking.price,
				place: booking.place._id,
				checkIn: booking.checkIn,
				checkOut: booking.checkOut,
				numberOfGuests: booking.numberOfGuests,
				name: booking.name,
				phone: booking.phone,
			});
			window.location = response.data.url;
		} catch (error) {
			console.error("Failed to create checkout session:", error);
		}
	};

	if (loading) {
		return <div className="text-center text-2xl mt-8">Loading...</div>;
	}

	if (!booking) {
		return (
			<div className="text-center text-2xl mt-8">Booking not found</div>
		);
	}

	const nights = differenceInCalendarDays(
		new Date(booking.checkOut),
		new Date(booking.checkIn)
	);

	const getStatusBadge = () => {
		const statusStyles = {
			pending: "bg-yellow-100 text-yellow-800",
			completed: "bg-green-100 text-green-800",
			failed: "bg-red-100 text-red-800",
		};

		return (
			<span
				className={`px-3 py-1 rounded-full text-sm ${
					statusStyles[booking.paymentStatus]
				}`}
			>
				{booking.paymentStatus.charAt(0).toUpperCase() +
					booking.paymentStatus.slice(1)}
			</span>
		);
	};

	return (
		<div className="max-w-2xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
			<div className="text-center mb-6">
				<h1 className="text-3xl font-bold mb-[5px]">Booking Details</h1>
				<div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
					<span>Booking ID: {booking._id}</span>
					{getStatusBadge()}
				</div>
			</div>

			{booking.paymentStatus === "pending" && (
				<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
					<p className="font-semibold">Payment Pending</p>
					<p className="text-sm">
						Your booking is not confirmed yet. Please complete the
						payment to secure your place.
					</p>
					<button
						onClick={handlePayment}
						className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
					>
						Complete Payment
					</button>
				</div>
			)}

			{booking.paymentStatus === "failed" && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
					<p className="font-semibold">Payment Failed</p>
					<p className="text-sm">
						Your payment was not successful. Please try booking
						again.
					</p>
					<button
						onClick={handlePayment}
						className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
					>
						Retry Payment
					</button>
				</div>
			)}

			{booking.paymentStatus === "completed" && (
				<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
					<p className="font-semibold">Booking Confirmed</p>
					<p className="text-sm">
						Your payment was successful. Enjoy your stay!
					</p>
				</div>
			)}
			<div className="mb-5">
				<PlaceGallery place={booking.place} />
			</div>

			{/* Rest of the component remains the same */}
			<div className="border-t border-b border-gray-200 py-4 mb-4">
				<Link
					to={`/place/${booking.place._id}`}
					className="sm:text-2xl font-semibold mb-2"
				>
					{booking.place.title}
				</Link>
				<p className="text-xs sm:text-sm text-gray-600">
					{booking.place.address}
				</p>
			</div>

			<div className="flex justify-between items-center mb-4">
				<div>
					<h3 className="text-lg font-semibold">Check-in</h3>
					<p>
						{format(new Date(booking.checkIn), "EEE, MMM d, yyyy")}
					</p>
					<p className="text-sm text-gray-500">After 3:00 PM</p>
				</div>
				<div className="text-right">
					<h3 className="text-lg font-semibold">Check-out</h3>
					<p>
						{format(new Date(booking.checkOut), "EEE, MMM d, yyyy")}
					</p>
					<p className="text-sm text-gray-500">Before 10:00 AM</p>
				</div>
			</div>

			<div className="bg-gray-100 p-4 rounded-lg mb-4">
				<div className="flex justify-between mb-2">
					<span>Duration of stay:</span>
					<span>{nights} nights</span>
				</div>
				<div className="flex justify-between mb-2">
					<span>Guests:</span>
					<span>{booking.numberOfGuests}</span>
				</div>
				<div className="flex justify-between font-semibold">
					<span>Total Price:</span>
					<span>₹{booking.price}</span>
				</div>
			</div>

			<div className="text-center text-sm text-gray-500">
				<p>Thank you for choosing our accommodation!</p>
				<p>
					For any questions, please contact us at
					travelnestsupport@gmail.com
				</p>
			</div>
		</div>
	);
};

export default BookingPage;
