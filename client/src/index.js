import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {AuthProvider} from "react-auth-kit";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<AuthProvider
			authType={"cookie"}
			authName={"_auth"}
			cookieDomain={window.location.hostname}
			cookieSecure={window.location.protocol === "https:"}
		>
			<Router>
				<App />
			</Router>
		</AuthProvider>
	</React.StrictMode>
);