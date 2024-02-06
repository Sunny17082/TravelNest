import React, { useState } from "react";

const PlaceGallery = ({ place }) => {
	const [showAllPhotos, setShowAllPhotos] = useState(false);

	if (showAllPhotos) {
		return (
			<div className="absolute inset-0 bg-black min-w-full text-white min-h-screen ">
				<div className="bg-black p-8 grid gap-4">
					<h2 className="text-3xl mr-36">Photos of {place?.title}</h2>
					<div>
						<button
							onClick={() => {
								setShowAllPhotos(false);
							}}
							className="fixed flex gap-1 py-2 px-4 rounded-md bg-white text-black shadow shadow-black right-10 top-8"
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
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
							Close Photos
						</button>
					</div>
					{place?.photos?.length > 0 &&
						place.photos.map((photo) => (
							<div className="flex justify-center lg:px-64">
								<img
									className="rounded-2xl"
									src={
										"http://localhost:5000/uploads/" + photo
									}
								/>
							</div>
						))}
				</div>
			</div>
		);
	}

    return (
		<>
			<div className="relative">
				<div className="rounded-3xl overflow-hidden grid gap-2 grid-cols-[2fr_1fr]">
					<div>
						{place.photos?.[0] && (
							<div>
								<img
									onClick={() => {
										setShowAllPhotos(true);
									}}
									className="aspect-square object-cover cursor-pointer"
									src={
										"http://localhost:5000/uploads/" +
										place.photos[0]
									}
									alt=""
								/>
							</div>
						)}
					</div>
					<div className="grid">
						{place.photos?.[1] && (
							<img
								onClick={() => {
									setShowAllPhotos(true);
								}}
								className="aspect-square object-cover cursor-pointer"
								src={
									"http://localhost:5000/uploads/" +
									place.photos[1]
								}
								alt=""
							/>
						)}
						<div className="overflow-hidden">
							{place.photos?.[2] && (
								<img
									onClick={() => {
										setShowAllPhotos(true);
									}}
									className="aspect-square object-cover relative top-2 cursor-pointer"
									src={
										"http://localhost:5000/uploads/" +
										place.photos[2]
									}
									alt=""
								/>
							)}
						</div>
					</div>
				</div>
				<button
					onClick={() => setShowAllPhotos(true)}
					className="flex gap-1 bg-white text-black absolute bottom-2 right-2 py-2 px-4 rounded-2xl shadow-md shadow-gray-500"
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
							d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
						/>
					</svg>
					more photos
				</button>
			</div>
		</>
	);
};

export default PlaceGallery;
