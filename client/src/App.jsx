import "./index.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Main from "./Main";
import Register from "./components/Register";
import Invite from "./components/Invite.jsx";
import { RequireAuth } from "react-auth-kit";

function App() {
	return (
		<Routes>
			<Route
				path="/*"
				element={
					<RequireAuth loginPath="/login">
						<Main />
					</RequireAuth>
				}
			></Route>
			<Route
				path="/invite/:code"
				element={
					<RequireAuth loginPath="/login">
						<Invite />
					</RequireAuth>
				}
			></Route>

			<Route path="/login" element={<Login />}></Route>
			<Route path="/register" element={<Register />}></Route>
		</Routes>
	);
}

export default App;
