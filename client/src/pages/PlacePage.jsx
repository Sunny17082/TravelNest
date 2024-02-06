import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import BookingOption from "../components/BookingOption";
import PlaceGallery from "../components/PlaceGallery";
import PlaceAddress from "../components/PlaceAddress";

const PlacePage = () => {
	const { id } = useParams();
	const [place, setPlace] = useState([]);
	

	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get("/place/" + id).then((response) => {
			setPlace(response.data);
		});
	}, []);

	if (!place) return "";

	return (
		<div className="mt-4 bg-gray-100 -mx-8 px-8 py-8 lg:-mx-64 lg:px-64">
			<h1 className="text-3xl">{place.title}</h1>
			<PlaceAddress place={place}/>
			<PlaceGallery place={place} />
			<div className="grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] mt-8 pb-8">
				<div>
					<div className="mb-4">
						<h2 className="text-2xl font-semibold">Description</h2>
						{place.description}
					</div>
					Check-in: {place.checkIn} <br />
					Check-out: {place.checkOut} <br />
					Max number of guests: {place.maxGuests}
				</div>
				<BookingOption place={place} />
			</div>
			<div className="bg-white -mx-8 px-8 -mb-16 py-8 border-t lg:-mx-64 lg:px-64">
				<div className="mt-4 text-2xl font-semibold">Extra Info</div>
				<div className="mt-2 mb-4 text-sm text-gray-600 leading-5">
					{place.extraInfo}
				</div>
			</div>
		</div>
	);
};

export default PlacePage;
