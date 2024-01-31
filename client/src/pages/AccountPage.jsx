import React, { useContext } from 'react'
import { UserContext } from '../UserContext';
import { Link, Navigate, useParams } from 'react-router-dom';

const AccountPage = () => {
    const { user, ready } = useContext(UserContext);

    let { subpage } = useParams();
	if (subpage === undefined) {
		subpage = "profile";
	}

    if (!ready) {
        return <div>Loading...</div>
    }

    if (ready && !user) {
        return <Navigate to="/login" />
    }

    function linkClasses(type="null") {
        let classes = "px-6 py-2";
        if (type === subpage) {
            classes += " bg-primary text-white rounded-xl";
        }
        return classes;
    }

    return (
		<div>
			<nav className="w-full flex mt-8 mb-8 gap-4 justify-center">
				<Link
					className={linkClasses("profile")}
					to="/account"
				>
					My Profile
				</Link>
				<Link className={linkClasses("bookings")} to="/account/bookings">
					My Bookings
				</Link>
				<Link className={linkClasses("places")} to="/account/places">
					My Accomodation
				</Link>
            </nav>
            {subpage === "profile" && (
                <div className='text-center max-w-lg mx-auto'>
                    Hello, {user.name}<br/> Email ({user.email})<br />
                    <button className='primary max-w-sm'>Logout</button>
                </div>
            )}
		</div>
	);
}

export default AccountPage;