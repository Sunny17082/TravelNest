import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../components/Perks";
import PhotosUploader from "../components/PhotosUploader";

const PlacesPage = () => {
	const { action } = useParams();
	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [addedPhotos, setAddedPhotos] = useState([]);
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
					<PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
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
