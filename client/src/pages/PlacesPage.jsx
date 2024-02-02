import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../components/Perks";

const PlacesPage = () => {
	const { action } = useParams();
	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [photoLink, setPhotoLink] = useState("");
	const [description, setDescription] = useState("");
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [maxGuests, setMaxGuests] = useState(1);

	function inputHeader(text) {
		return <label className="text-2xl mt-4">{text}</label>;
	}

	function inputDescription(text) {
		return <p className="text-gray-500 text-sm">{text}</p>;
	}

	function preInput(header, description) {
		return (
			<>
				{inputHeader(header)}
				{inputDescription(description)}
			</>
		);
	}

	return (
		<div>
			{action !== "new" && (
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
			)}
			{action === "new" && (
				<form>
					{preInput(
						"Title",
						"title for your place, should be short and catchy as in advertisement"
					)}
					<input
						type="text"
						value={title}
						onChange={(ev) => setTitle(ev.target.value)}
						placeholder="title, for example: my lovely apt"
					/>
					{preInput("Address", "address to this place")}
					<input
						type="text"
						value={address}
						onChange={(ev) => setAddress(ev.target.value)}
						placeholder="address"
					/>
					{preInput("Photos", "more = better")}
					<div className="flex gap-2">
						<input
							type="text"
							value={photoLink}
							onChange={(ev) => setPhotoLink(ev.target.value)}
							placeholder="Add using link .....png"
						/>
						<button className="bg-gray-200 grow text-black px-4 rounded-2xl">
							Add&nbsp;Photo
						</button>
					</div>
					<div className="mt-3 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
						<button className="flex justify-center gap-1 border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-8 h-8"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
								/>
							</svg>
							Upload
						</button>
					</div>
					{preInput(
						"Description",
						"description of your lovely place"
					)}
					<textarea
						value={description}
						onChange={(ev) => setDescription(ev.target.value)}
						placeholder="description"
					></textarea>
					{preInput("Perks", "select all the perks of your place")}
					<Perks selected={perks} onChange={setPerks} />
					{preInput("Extra info", "house rules, etc...")}
					<textarea
						value={extraInfo}
						onChange={(ev) => setExtraInfo(ev.target.value)}
						placeholder="Extra info about house rules"
					></textarea>
					{preInput(
						"Check-in/Check-out times",
						"Add check-in & check-out times, remember to have some time windows for cleaning the room between guests"
					)}
					<div className="grid mb-5 gap-2 sm:grid-cols-3">
						<div>
							<h3 className="mt-2 -mb-1">Check-in</h3>
							<input
								type="time"
								value={checkIn}
								onChange={(ev) => {
									setCheckIn(ev.target.value);
								}}
							/>
						</div>
						<div>
							<h3 className="mt-2 -mb-1">Check-out</h3>
							<input
								type="time"
								value={checkOut}
								onChange={(ev) => setCheckOut(ev.target.value)}
							/>
						</div>
						<div>
							<h3 className="mt-2 -mb-1">Max guests</h3>
							<input
								type="number"
								value={maxGuests}
								onChange={(ev) => setMaxGuests(ev.target.value)}
								placeholder="6"
							/>
						</div>
					</div>
					<button className="primary">Save</button>
				</form>
			)}
		</div>
	);
};

export default PlacesPage;
