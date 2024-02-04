import axios from 'axios';
import React, { useEffect, useState } from 'react';

const IndexPage = () => {
	const [places, setPlaces] = useState([]);

	useEffect(() => {
		axios.get("/places").then(response => {
			setPlaces(response.data);
		})
	},[])

	return (
		<div className="mt-8 gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-fit">
			{places.length > 0 &&
				places.map((place) => (
					<div>
						<div className="bg-gray-500 mb-2 aspect-square rounded-2xl flex cursor-pointer">
							{place.photos?.[0] && (
								<img
									className="rounded-2xl aspect-square object-cover"
									src={
										"http://localhost:5000/uploads/" +
										place.photos[0]
									}
									alt=""
								/>
							)}
						</div>
						<h3 className="text-xs font-bold">{place.address}</h3>
						<h2 className="text-sm truncate mb-1">{place.title}</h2>
						<h1 className="text-sm font-semibold">
							₹{place.price}/night
						</h1>
					</div>
				))}
		</div>
	);
}

export default IndexPage;