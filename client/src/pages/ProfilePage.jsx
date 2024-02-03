import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import AccountNav from '../components/AccountNav';

const ProfilePage = () => {
    const [redirect, setRedirect] = useState(false);
    const { user, ready, setUser } = useContext(UserContext);

    if (!ready) {
        return <div>Loading...</div>;
	}

    if (ready && !user && !redirect) {
        return <Navigate to="/login" />
    }

    async function logout() {
        await axios.post("/logout");
        setRedirect(true);
        setUser(null);  
    }

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
		<div>
			<AccountNav />
            <div className="text-center max-w-lg mx-auto">
                Welcome to airbnb page {user.name}
                <br /> Logged in ({user.email})<br />
                <button onClick={logout} className="primary max-w-sm">
                    Logout
                </button>
            </div>
		</div>
	);
}

export default ProfilePage;