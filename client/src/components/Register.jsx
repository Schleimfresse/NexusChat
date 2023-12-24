import React from "react";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import InputDefault from "./InputDefault";
import { useNavigate } from "react-router-dom";

export default function Register() {
	const signIn = useSignIn();
	const signOut = useSignOut();
	const navigation = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const body = {
				username: document.getElementById("username").value,
				alias: document.getElementById("alias").value,
				email: document.getElementById("email").value,
				password: document.getElementById("password").value,
			};

			const response = await axios.post("https://localhost:3300/auth/signup", body);

			signIn({
				token: response.data.message.token,
				expiresIn: 3600,
				tokenType: "Bearer",
				authState: {
					username: response.data.message.username,
					alias: response.data.message.alias,
					status: "",
				},
			});
			navigation("/channels/@me");

		} catch (err) {
			console.log(err.message, err.name, err);
		}
	};

	return (
		<div>
			Register
			<form onSubmit={onSubmit} className="p-2 w-96">
				<InputDefault placeholder="Username (has to be unique)" type="text" id="username"></InputDefault>
				<InputDefault placeholder="Display name" type="text" id="alias"></InputDefault>
				<InputDefault placeholder="E-Mail" type="email" id="email"></InputDefault>
				<InputDefault placeholder="Password" type="password" id="password"></InputDefault>
				<div id="submit-wrapper">
					<InputDefault id="submit-btn" type="submit" initial_value="Register" />
				</div>
			</form>
			<button onClick={signOut}>Signout</button>
		</div>
	);
}
