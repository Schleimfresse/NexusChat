import SideBar from "./components/SideBar";
import { useState } from "react";
import AddServer from "./components/AddServer";
import SecondSidebar from "./components/Second-Sidebar";
import { ServerContext } from "./ServerContext";

export default function Main() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedServer, setSelectedServer] = useState(null);
	const updateSelectedServer = (server) => {
		setSelectedServer(server);
	};

	return (
		<ServerContext.Provider value={{ selectedServer, updateSelectedServer }}>
			<div className="relative overflow-hidden w-full h-full flex bg-gray-standard text-rendering">
				<SideBar openModal={() => setIsModalOpen(true)} isModalOpen={isModalOpen}></SideBar>
				<div className="relative flex-grow flex flex-col overflow-hidden ">
					<div className="flex items-stretch justify-start min-w-0 min-h-0 flex-1">
						<SecondSidebar></SecondSidebar>
						<video className="h-40 w-60" id="localVideo" muted autoPlay></video>
						<div id="videoContainer"></div>
						<div id="textPublish"></div>
					</div>
				</div>
				{isModalOpen && <AddServer closeModal={() => setIsModalOpen(false)}></AddServer>}
			</div>
		</ServerContext.Provider>
	);
}
