import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../components/Image";
import { ChevronDown, ChevronUp } from "lucide-react";

const IndexPage = () => {
	const [places, setPlaces] = useState([]);
	const [filteredPlaces, setFilteredPlaces] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [showFilters, setShowFilters] = useState(false);
	const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
	const [sortOption, setSortOption] = useState("");

	const tags = ["Beach", "Mountain", "City", "Countryside", "Historic"];

	useEffect(() => {
		// Fetch places with their average ratings
		axios.get("/places").then(async (response) => {
			const placesData = response.data; 

			// Fetch reviews for each place
			const placesWithRatings = await Promise.all(
				placesData.map(async (place) => {
					const reviewsResponse = await axios.get(
						`/reviews/${place._id}`
					);
					const reviews = reviewsResponse.data;

					// Calculate average rating
					const totalRating = reviews.reduce(
						(sum, review) => sum + review.rating,
						0
					);
					const averageRating =
						reviews.length > 0 ? totalRating / reviews.length : 0;

					return {
						...place,
						averageRating,
						reviewCount: reviews.length,
					};
				})
			);

			setPlaces(placesWithRatings);
			setFilteredPlaces(placesWithRatings);
		});
	}, []);

	useEffect(() => {
		const filtered = places.filter(
			(place) =>
				(place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					place.address
						.toLowerCase()
						.includes(searchTerm.toLowerCase())) &&
				(selectedTags.length === 0 ||
					selectedTags.some((tag) => place.tags?.includes(tag))) &&
				place.price >= priceRange.min &&
				place.price <= priceRange.max
		);

		let sorted = [...filtered];
		if (sortOption === "priceLowToHigh") {
			sorted.sort((a, b) => a.price - b.price);
		} else if (sortOption === "priceHighToLow") {
			sorted.sort((a, b) => b.price - a.price);
		} else if (sortOption === "topRated") {
			sorted.sort(
				(a, b) =>
					b.averageRating - a.averageRating ||
					b.reviewCount - a.reviewCount
			);
		} else if (sortOption === "maxGuests") {
			sorted.sort((a, b) => b.maxGuests - a.maxGuests);
		}

		setFilteredPlaces(sorted);
	}, [searchTerm, priceRange, sortOption, places, selectedTags]);

	const toggleTag = (tag) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	return (
		<div className="container mx-auto">
			<div className="my-[10px]">
				<input
					type="text"
					placeholder="Search by title or place"
					className="w-full p-2 border rounded"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			<div className="mb-[10px] flex justify-between gap-2">
				<div className="flex gap-[5px] overflow-x-auto no-scrollbar">
					{tags.map((tag) => (
						<button
							key={tag}
							className={`px-2 py-1 rounded-md ${
								selectedTags.includes(tag)
									? "bg-black text-white"
									: "bg-gray-600"
							}`}
							onClick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					))}
				</div>
				<button
					className="flex px-2 py-1 rounded-md bg-primary"
					onClick={() => setShowFilters(!showFilters)}
				>
					Filters {showFilters ? <ChevronUp /> : <ChevronDown />}
				</button>
			</div>

			<div className="mb-6">
				{showFilters && (
					<div className="mt-2">
						<div className="mb-2">
							<label>Price Range:</label>
							<input
								type="number"
								placeholder="Min"
								className="w-24 p-1 border rounded mr-2"
								value={priceRange.min}
								onChange={(e) =>
									setPriceRange((prev) => ({
										...prev,
										min: parseInt(e.target.value) || 0,
									}))
								}
							/>
							<input
								type="number"
								placeholder="Max"
								className="w-24 p-1 border rounded"
								value={priceRange.max}
								onChange={(e) =>
									setPriceRange((prev) => ({
										...prev,
										max: parseInt(e.target.value) || 100000,
									}))
								}
							/>
						</div>
						<div>
							<label>Sort by:</label>
							<select
								className="ml-2 p-1 border rounded"
								value={sortOption}
								onChange={(e) => setSortOption(e.target.value)}
							>
								<option value="">Latest</option>
								<option value="priceLowToHigh">
									Price: Low to High
								</option>
								<option value="priceHighToLow">
									Price: High to Low
								</option>
								<option value="topRated">Top Rated</option>
								<option value="maxGuests">
									Capacity: Most Guests
								</option>
							</select>
						</div>
					</div>
				)}
			</div>

			<div className="mt-8 gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-fit">
				{filteredPlaces?.length > 0 &&
					filteredPlaces?.map((place) => (
						<Link key={place._id} to={"/place/" + place._id}>
							<div className="bg-gray-500 mb-2 aspect-square rounded-2xl flex relative">
								{place.photos?.[0] && (
									<Image
										className="rounded-2xl aspect-square object-cover"
										src={place.photos[0]}
									/>
								)}
								<span className="absolute left-2 top-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
									<span className="text-yellow-400">★</span>
									<span>
										{place.averageRating.toFixed(1)}
									</span>
								</span>
							</div>
							<h3 className="text-xs font-bold">
								{place.address}
							</h3>
							<h2 className="text-sm truncate mb-1">
								{place.title}
							</h2>
							<div className="flex justify-between items-center">
								<h1 className="text-sm font-semibold">
									₹{place.price}/night
								</h1>
							</div>
						</Link>
					))}
			</div>
		</div>
	);
};

export default IndexPage;
