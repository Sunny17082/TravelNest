import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const RegisterPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function registerUser(e) {
		e.preventDefault();
	}

  	return (
		<div className="mt-5 grow flex items-center justify-around">
			<div className="mb-64">
				<h1 className="text-4xl font-semibold text-center mb-5">
					Register
				</h1>
				<form className="max-w-md mx-auto" onSubmit={registerUser}>
					<input
						type="text"
						placeholder="your name here"
						value={name}
						onChange={(ev) => {
							setName(ev.target.value);
						}}
					/>
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
					<button className="primary">Register</button>
				</form>
				<div className="text-center py-2 text-gray-500">
					Already have an account?{" "}
					<Link to="/login" className="underline text-black">
						login
					</Link>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage