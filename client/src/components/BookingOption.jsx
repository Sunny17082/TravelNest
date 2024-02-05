import React from 'react'

const BookingOption = ({place}) => {
  return (
		<>
			<div className="bg-white p-4 rounded-2xl shadow">
				<div className="text-2xl text-center font-semibold">
					Price: ₹{place.price}/night
				</div>
				<div className="border rounded-2xl m-4">
					<div className="flex">
						<div className="px-3 py-4">
							<label>Check-in</label>
							<input type="date" />
						</div>
						<div className="px-3 py-4 border-l">
							<label>Check-out</label>
							<input type="date" />
						</div>
					</div>
					<div className="px-3 py-4 border-t">
						<label>Number of Guests</label>
						<input type="number" value="1" />
					</div>
				</div>
				<button className="primary">Book now</button>
			</div>
		</>
  );
}

export default BookingOption