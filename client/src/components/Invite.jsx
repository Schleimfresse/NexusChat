import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";

export default function Invite() {
	const { code } = useParams();
	const [text, setText] = useState("");
	const authUser = useAuthUser();
	const navigate = useNavigate();

	useEffect(() => {
		axios.get(`https://localhost:3300/invite/${code}/${authUser().userId}`).then((res) => {
			setTimeout(() => {
				setText("Redirecting...");
				setTimeout(() => {
					navigate("/channels/@me");
				}, 2000);
			}, 2000);
		});
	}, []);

	return <div>{text ? <p>{text}</p> : <div>Invite: {code}</div>}</div>;
}
