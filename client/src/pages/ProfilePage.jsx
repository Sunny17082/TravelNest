import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import AccountNav from '../components/AccountNav';
import { LogOut, User, Mail, Loader } from "lucide-react";


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
			<div className="max-w-xl mx-auto mt-8 bg-white rounded-2xl shadow-md overflow-hidden">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
					<div className="flex flex-col items-center">
						<div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
							<User className="w-12 h-12 text-blue-500" />
						</div>
						<h1 className="text-2xl font-bold">
							Welcome to TravelNest
						</h1>
					</div>
				</div>

				{/* Profile Info */}
				<div className="px-6 py-8">
					<div className="space-y-6">
						{/* User Details */}
						<div className="space-y-4">
							<div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
								<User className="w-5 h-5 text-gray-500" />
								<div>
									<p className="text-sm text-gray-500">
										Name
									</p>
									<p className="font-medium">{user.name}</p>
								</div>
							</div>

							<div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
								<Mail className="w-5 h-5 text-gray-500" />
								<div>
									<p className="text-sm text-gray-500">
										Email
									</p>
									<p className="font-medium">{user.email}</p>
								</div>
							</div>
						</div>

						{/* Logout Button */}
						<div className="pt-4">
							<button
								onClick={logout}
								className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200"
							>
								<LogOut className="w-5 h-5" />
								<span>Logout</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;