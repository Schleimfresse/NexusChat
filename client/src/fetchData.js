import axios from "axios";
import { useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";

export default async function fetchData(AuthHeader, url) {
	const res = await axios.get(url, {
		headers: {
			Authorization: AuthHeader,
		},
	});
	return res.data;
}
