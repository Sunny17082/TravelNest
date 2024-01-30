import React from 'react'
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
		<div className="mt-5 grow flex items-center justify-around">
			<div className="mb-64">
				<h1 className="text-4xl font-semibold text-center mb-5">Register</h1>
				<form className="max-w-md mx-auto">
					<input type="text" placeholder="your name here" />
					<input type="email" placeholder="your@email.com" />
					<input type="password" placeholder="password" />
					<button className="primary">Login</button>
				</form>
				<div className="text-center py-2 text-gray-500">
					Already have an account? <Link to="/login" className="underline text-black">login</Link>
				</div>
			</div>
		</div>
  );
}

export default RegisterPage