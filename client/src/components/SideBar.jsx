import { BsPlus } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const serverdata = [
	{ id: "Finn kommt zu spät", url: "/zuspät" },
	{ id: "League", url: "/lol" },
	{ id: "Dota 2", url: "/dota" },
	{ id: "Linus Test server", url: "/testserver" },
];
export default function SideBar({ openModal, isModalOpen }) {
	const [selectedServer, setSelectedServer] = useState(null);
	const [addServerSelected, setAddServerSelected] = useState(false);
	const [activeAnimation, setActiveAnimation] = useState(null);

	useEffect(() => {
		if (!isModalOpen) {
			setAddServerSelected(false);
			setActiveAnimation(null)
		}
	}, [isModalOpen]);

	const handleElementClick = (elementId) => {
		if (elementId === "addServer") {
			setAddServerSelected(true);
			openModal();
		} else {
			setAddServerSelected(false);
			setSelectedServer(elementId);
		}
		setActiveAnimation(elementId);
	};

	const selected = (elementId) => {
		return (addServerSelected && elementId === "addServer") || selectedServer === elementId;
	};

	const SideBarIcon = ({ icon, text, elementId, server }) => (
		<div className="relative w-[72]">
			<Link to={server.url} onClick={() => handleElementClick(server.id)}>
				<div
					className={`sidebar-icon group ${selected(elementId) ? "active" : "rounded-3xl"} ${
						activeAnimation === elementId ? "animate-drop" : ""
					}`}
				>
					{icon}
					<span className="sidebar-tooltip group-hover:scale-100">{text}</span>
				</div>
			</Link>
		</div>
	);

	return (
		<div
			className="relative top-0 left-0 h-screen w-[72px] flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg"
		>
			<SideBarIcon
				text="Direct messages"
				icon={<FaFire size="28" />}
				elementId="dm"
				server={{ url: "/channels/@me", id: "dm" }}
			/>
			<Divider />
			{serverdata.map((server) => (
				<SideBarIcon elementId={server.id} icon={<FaPoo size="20" />} text={server.id} server={server} />
			))}
			<Divider />
			<div className="relative w-[72]">
				<div
					onClick={() => handleElementClick("addServer")}
					className={`sidebar-icon group ${selected("addServer") ? "active" : "rounded-3xl"} ${
						activeAnimation === "addServer" ? "animate-drop" : ""
					}`}
				>
					<BsPlus size="28" />
					<span className="sidebar-tooltip group-hover:scale-100">Create a server</span>
				</div>
			</div>
		</div>
	);
}

const Divider = () => <hr className="sidebar-hr" />;
