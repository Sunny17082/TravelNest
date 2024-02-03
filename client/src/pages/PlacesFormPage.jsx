import { useState, React } from 'react';
import Perks from "../components/Perks";
import PhotosUploader from "../components/PhotosUploader";
import axios from "axios";
import AccountNav from '../components/AccountNav';
import { Navigate } from 'react-router-dom';

const PlacesFormPage = () => {
    const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [description, setDescription] = useState("");
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    
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

	async function addNewPlace(ev) {
		ev.preventDefault();
		await axios.post("/places", {
			title,
			address,
			addedPhotos,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
        });
        setRedirect(true);
    }
    
    if (redirect) {
        return <Navigate to={"/account/places"} />
    }

    return (
        <>
            <AccountNav />
			<form onSubmit={addNewPlace}>
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
				<PhotosUploader
					addedPhotos={addedPhotos}
					onChange={setAddedPhotos}
				/>
				{preInput("Description", "description of your lovely place")}
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
		</>
	);
}

export default PlacesFormPage