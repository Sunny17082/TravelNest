import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";

const PlacesPage = () => {
	const [places, setPlaces] = useState([]);

	useEffect(() => {
		axios.get("/user-places").then(({ data }) => {
			setPlaces(data);
		});
	}, [])
	
	return (
		<div>
			<AccountNav />
			<div className="text-center">
				<Link
					className={
						"inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
					}
					to={"/account/places/new"}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
					Add new place
				</Link>
			</div>
			<div className="flex flex-col gap-4 mt-4">
				{places.length > 0 &&
					places.map((place) => (
						<Link to={"/account/places/"+place._id} key={place._id} className="flex gap-4 bg-gray-200 p-4 rounded-2xl cursor-pointer">
							<div className="flex w-32 h-32 shrink-0">
								<PlaceImg place={place} className={"aspect-square object-cover rounded-2xl"}/>
							</div>
							<div className="h-32 overflow-hidden">
								<h2 className="text-xl">{place.title}</h2>
								<p className="text-sm mt-2 overflow-hidden">{place.description}</p>
							</div>
						</Link>
					))}
			</div>
		</div>
	);
};

export default PlacesPage;
