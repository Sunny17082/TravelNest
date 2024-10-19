import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactStars from "react-stars";

const ReviewComponent = ({ placeId }) => {
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
	const [averageRating, setAverageRating] = useState(0);

	useEffect(() => {
		fetchReviews();
	}, [placeId]);

	const fetchReviews = async () => {
		try {
			const response = await axios.get(`/reviews/${placeId}`);
			setReviews(response.data);
			calculateAverageRating(response.data);
		} catch (error) {
			console.error("Error fetching reviews:", error);
		}
	};

	const calculateAverageRating = (reviewsData) => {
		if (reviewsData.length === 0) return;
		const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
		setAverageRating((sum / reviewsData.length).toFixed(1));
	};

	const handleRatingChange = (newRating) => {
		setNewReview({ ...newReview, rating: newRating });
	};

	const handleCommentChange = (e) => {
		setNewReview({ ...newReview, comment: e.target.value });
	};

	const handleSubmitReview = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/reviews/${placeId}`, newReview);
			setNewReview({ rating: 0, comment: "" });
			fetchReviews();
		} catch (error) {
			console.error("Error submitting review:", error);
		}
	};

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-semibold mb-4">Reviews</h2>
			<div className="mb-4">
				<div className="flex gap-2">
					<span className="text-lg mt-[5px]">{averageRating}</span>
					<ReactStars
						count={5}
						value={parseFloat(averageRating)}
						size={20}
						edit={false}
						color2={"#ffd700"}
					/>
				</div>
				<p className="text-sm text-gray-600">
					({reviews.length} reviews)
				</p>
			</div>
			<form onSubmit={handleSubmitReview} className="mb-8">
				<div className="mb-2">
					<ReactStars
						count={5}
						onChange={handleRatingChange}
						size={24}
						color2={"#ffd700"}
						value={newReview.rating}
					/>
				</div>
				<textarea
					value={newReview.comment}
					onChange={handleCommentChange}
					className="w-full p-2 border rounded"
					placeholder="Write your review..."
					rows="3"
				/>
				<button
					type="submit"
					className="mt-2 bg-primary text-white px-4 py-2 rounded"
				>
					Submit Review
				</button>
			</form>
			<div>
				{reviews.map((review, index) => (
					<div key={index} className="border-b pb-4 mb-4">
						<div className="flex items-start gap-[10px]">
							<div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xl">
								{review.user.name.charAt(0).toUpperCase()}
							</div>
							<div className="basis-5 flex-grow">
								<div className="flex items-center justify-between">
									<p className="font-semibold">
										{review.user.name}
									</p>
								</div>
								<ReactStars
									count={5}
									value={review.rating}
									size={20}
									edit={false}
									color2={"#ffd700"}
								/>
								<p>{review.comment}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ReviewComponent;
