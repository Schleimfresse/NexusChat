import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ServerContext } from "../ServerContext";
import axios from "axios";

export default function SideBar({ openModal, isModalOpen }) {
	const [addServerSelected, setAddServerSelected] = useState(false);
	const [activeAnimation, setActiveAnimation] = useState(null);
	const [serverdata, setServerdata] = useState([]);
	const { selectedServer, updateSelectedServer } = useContext(ServerContext);
	useEffect(() => {
		if (!isModalOpen) {
			setAddServerSelected(false);
			setActiveAnimation(null);
		}
	}, [isModalOpen]);

	useEffect(() => {
		axios
			.get("https://localhost:3300/api/servers/list")
			.then((res) => {
				setServerdata(res.data);
			})
			.catch((err) => {
				console.error("Error fetching serverinfo");
			});
	}, []);

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

	const SideBarIcon = ({ icon, text, elementId, id, url }) => (
		<div className="relative w-[72]">
			<Link to={`/channels/${url}/`} onClick={() => handleElementClick(id)}>
				<div className="group">
					<span className="sidebar-tooltip group-hover:scale-100">{text}</span>
					<div
						className={`sidebar-icon ${selected(elementId) ? "active" : "rounded-3xl"} ${
							activeAnimation === elementId ? "animate-drop" : ""
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
			{serverdata.map((server, index) => (
				<SideBarIcon
					elementId={server.server_id}
					icon={server.img}
					text={server.server_name}
					key={index}
					url={server.server_id}
					id={server.server_id}
				/>
			))}
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
