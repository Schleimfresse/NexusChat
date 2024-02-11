import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { serverContext, serverDataContext } from "../Contexts";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";

export default function SideBar({ openModal, isModalOpen }) {
	const [addServerSelected, setAddServerSelected] = useState(false);
	const [activeAnimation, setActiveAnimation] = useState(null);
	const [iconBar, setIconBar] = useState(null);
	const { selectedServer, updateSelectedServer } = useContext(serverContext);
	const { serverdata, updateServerData } = useContext(serverDataContext);
	console.log(serverdata);
	const authuser = useAuthUser();

	useEffect(() => {
		if (!isModalOpen) {
			setAddServerSelected(false);
			setActiveAnimation(null);
		}
	}, [isModalOpen]);

	useEffect(() => {
		axios
			.get(`https://localhost:3300/api/${authuser().userId}/server`)
			.then((res) => {
				if (res.data !== null) {
					console.log(res.data);
					updateServerData(res.data);
				}
			})
			.catch((err) => {
				console.error("Error fetching serverinfo", err);
			});
		console.log("Current User:",authuser().userId);
	}, []);

	useEffect(() => {
		if (serverdata.length < 1) return;
		const iconBar = serverdata.map((server, index) => (
			<SideBarIcon icon={server.img} text={server.name} key={index} id={server.serverId} />
		));

		setIconBar(iconBar);
	}, [serverdata]);

	const handleElementClick = (elementId) => {
		if (elementId === "addServer") {
			setAddServerSelected(true);
			openModal();
		} else {
			setAddServerSelected(false);
			updateSelectedServer(elementId);
		}
		setActiveAnimation(elementId);
	};

	const selected = (elementId) => {
		return (addServerSelected && elementId === "addServer") || selectedServer === elementId;
	};

	const SideBarIcon = ({ icon, text, id }) => (
		<div className="relative w-[72]">
			<Link to={`/channels/${id}/`} onClick={() => handleElementClick(id)}>
				<div className="group">
					<span className="sidebar-tooltip group-hover:scale-100">{text}</span>
					<div
						className={`sidebar-icon ${selected(id) ? "active" : "rounded-3xl"} ${
							activeAnimation === id ? "animate-drop" : ""
						}`}
					>
						<img className="w-12 h-12 object-cover" alt="server" src={icon}></img>
					</div>
				</div>
			</Link>
		</div>
	);

	return (
		<div
			className="relative top-0 left-0 h-screen w-[72px] flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg"
		>
			<div className="relative w-[72]">
				<Link to="/channels/@me" onClick={() => handleElementClick("dm")}>
					<div className="group">
						<span className="sidebar-tooltip group-hover:scale-100">Direct Messages</span>
						<div
							className={`sidebar-icon hover:bg-sky-600  hover:text-white  ${
								selected("dm") ? "active-no-img" : "rounded-3xl  text-sky-500 bg-gray-700"
							} ${activeAnimation === "dm" ? "animate-drop" : ""}`}
						>
							<img className="w-12 h-12 object-cover" alt="server" src="/logo192.png"></img>
						</div>
					</div>
				</Link>
			</div>
			<Divider />
			{iconBar}
			<Divider />
			<div className="relative w-[72]">
				<div className="group">
					<span className="sidebar-tooltip group-hover:scale-100">Create a server</span>
					<div
						onClick={() => handleElementClick("addServer")}
						className={`sidebar-icon hover:bg-sky-600 hover:text-white ${
							selected("addServer") ? "active-no-img" : "rounded-3xl  text-sky-500 bg-gray-700"
						} ${activeAnimation === "addServer" ? "animate-drop" : ""}`}
					>
						<BsPlus size="28" />
					</div>
				</div>
			</div>
		</div>
	);
}

const Divider = () => <hr className="sidebar-hr" />;
