import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function loginUser(e) {
		e.preventDefault();
		try {
			await axios.post("/login", { email, password });
			alert("Login successful.");
		} catch (err) {
			alert("Login failed.");
		}
	}

    return (
		<div className="mt-5 grow flex items-center justify-around">
			<div className="mb-64">
				<h1 className="text-4xl font-semibold text-center mb-5">
					Login
				</h1>
				<form className="max-w-md mx-auto" onSubmit={loginUser}>
					<input
						type="email"
						placeholder="your@email.com"
						value={email}
						onChange={(ev) => {
							setEmail(ev.target.value);
						}}
					/>
					<input
						type="password"
						placeholder="password"
						value={password}
						onChange={(ev) => {
							setPassword(ev.target.value);
						}}
					/>
					<button className="primary">Login</button>
				</form>
				<div className="text-center py-2 text-gray-500">
					Don't have an account yet?{" "}
					<Link to="/register" className="underline text-black">
						Register now
					</Link>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;