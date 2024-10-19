import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ListTodo, HomeIcon } from "lucide-react";

const AccountNav = () => {
	const { pathname } = useLocation();
	const subpage = pathname.split("/")?.[2] || "profile";

	const navItems = [
		{
			label: "My Profile",
			path: "/account",
			icon: User,
			id: "profile",
		},
		{
			label: "My Bookings",
			path: "/account/bookings",
			icon: ListTodo,
			id: "bookings",
		},
		{
			label: "My Accommodations",
			path: "/account/places",
			icon: HomeIcon,
			id: "places",
		},
	];

	const isActive = (type) => type === subpage;

	return (
		<div className="bg-white/80 backdrop-blur-sm shadow-sm my-5">
			<nav className="max-w-4xl mx-auto px-4">
				<div className="flex items-center justify-center gap-2 py-4">
					{navItems.map((item) => (
						<Link
							key={item.id}
							to={item.path}
							className={`
                                relative flex items-center gap-2 px-4 py-2.5 rounded-lg
                                text-sm font-medium transition-all duration-200
                                hover:bg-gray-100
                                ${
									isActive(item.id)
										? "text-blue-600 bg-blue-50 hover:bg-blue-50"
										: "text-gray-600 hover:text-gray-900"
								}
                                sm:px-6
                            `}
						>
							<item.icon
								className={`w-4 h-4 ${
									isActive(item.id)
										? "text-blue-600"
										: "text-gray-400"
								}`}
							/>
							<span className="hidden sm:block">
								{item.label}
							</span>

							{/* Active indicator dot
							{isActive(item.id) && (
								<span className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-600 rounded-full transform -translate-x-1/2" />
							)} */}
						</Link>
					))}
				</div>
			</nav>
		</div>
	);
};

export default AccountNav;
