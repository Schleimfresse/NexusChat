import { useSignIn } from "react-auth-kit";
import axios from "axios";
import InputDefault from "./InputDefault";
import { useNavigate } from "react-router-dom";
export default function Login() {
	const signIn = useSignIn();
	const navigation = useNavigate();
	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const body = {
				username: document.getElementById("username").value,
				password: document.getElementById("password").value,
			};

			axios.post("https://localhost:3300/api/auth/login", JSON.stringify(body)).then((res) => {
				const data = res.data;
				signIn({
					token: data.token,
					expiresIn: 3600,
					tokenType: "Bearer",
					authState: { username: data.username, displayName: data.displayName, userId: data.userId, img: data.img },
				});
				navigation("/channels/@me");
			});
		} catch (err) {
			console.log(err.message, err.name, err);
		}
	};

	return (
		<div>
			<form onSubmit={onSubmit} className="p-2 w-96">
				<InputDefault placeholder="Username" type="text" id="username"></InputDefault>
				<InputDefault placeholder="Password" type="password" id="password"></InputDefault>
				<div id="submit-wrapper">
					<InputDefault id="submit-btn" type="submit" initial_value="Login" />
				</div>
			</form>
		</div>
	);
}
