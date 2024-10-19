import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { Plus, Pencil, Trash2, MapPin, DollarSign } from "lucide-react";

const PlacesPage = () => {
	const [places, setPlaces] = useState([]);
	const [deleteId, setDeleteId] = useState(null);

	useEffect(() => {
		loadPlaces();
	}, []);

	const loadPlaces = () => {
		axios.get("/user-places").then(({ data }) => {
			setPlaces(data);
		});
	};

	const handleDelete = async (placeId) => {
		try {
			await axios.delete(`/place/${placeId}`);
			setDeleteId(null);
			loadPlaces(); // Refresh the list
			alert("Place deleted successfully");
		} catch (error) {
			console.error("Error deleting place:", error);
			alert("Failed to delete place");
		}
	};

	return (
		<div className="max-w-6xl">
			<AccountNav />

			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold">Your Properties</h1>
				<Link
					className="inline-flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
					to={"/account/places/new"}
				>
					<Plus size={20} />
					Add new place
				</Link>
			</div>

			{places.length === 0 ? (
				<div className="text-center bg-gray-50 rounded-lg">
					<h3 className="text-xl text-gray-600 mb-4">
						You haven't added any properties yet
					</h3>
					<p className="text-gray-500 mb-6">
						Start by adding your first property
					</p>
					<Link
						className="inline-flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
						to={"/account/places/new"}
					>
						<Plus size={20} />
						Add your first property
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
					{places.map((place) => (
						<div
							key={place._id}
							className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
						>
							<div className="relative">
								<PlaceImg
									place={place}
									className="aspect-[4/3] object-cover w-full"
								/>
								<div className="absolute top-2 right-2 flex gap-2">
									<Link
										to={"/account/places/" + place._id}
										className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
									>
										<Pencil
											size={16}
											className="text-gray-600"
										/>
									</Link>
									<button
										onClick={() => setDeleteId(place._id)}
										className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
									>
										<Trash2
											size={16}
											className="text-red-500"
										/>
									</button>
								</div>
							</div>

							<div className="p-4">
								<h2 className="text-xl font-semibold mb-2 line-clamp-1">
									{place.title}
								</h2>

								<div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
									<MapPin size={14} />
									<span className="line-clamp-1">
										{place.address}
									</span>
								</div>

								<div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
									<DollarSign size={14} />
									<span>₹{place.price} per night</span>
								</div>

								<p className="text-gray-600 text-sm line-clamp-2">
									{place.description}
								</p>
							</div>
						</div>
					))}
				</div>
			)}

			{deleteId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold mb-2">
							Delete Property
						</h3>
						<p className="text-gray-600 mb-4">
							Are you sure you want to delete this property? This
							action cannot be undone.
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setDeleteId(null)}
								className="px-5 py-2 bg-gray-300 text-black rounded-lg"
							>
								Cancel
							</button>
							<button
								onClick={() => handleDelete(deleteId)}
								className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PlacesPage;
