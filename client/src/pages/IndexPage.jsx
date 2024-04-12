import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../components/Image';

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
					<Link key={place._id} to={"/place/"+place._id}>
						<div className="bg-gray-500 mb-2 aspect-square rounded-2xl flex">
							{place.photos?.[0] && (
								<Image
									className="rounded-2xl aspect-square object-cover"
									src={
										place.photos[0]
									}
								/>
							)}
						</div>
						<h3 className="text-xs font-bold">{place.address}</h3>
						<h2 className="text-sm truncate mb-1">{place.title}</h2>
						<h1 className="text-sm font-semibold">
							₹{place.price}/night
						</h1>
					</Link>
				))}
		</div>
	);
}

export default IndexPage;