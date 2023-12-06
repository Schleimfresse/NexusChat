import "./index.css";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import AddServer from "./components/AddServer";
import SecondSidebar from "./components/Second-Sidebar";
import { ServerContext } from "./ServerContext";

function App() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedServer, setSelectedServer] = useState(null)
	useEffect(() => {
		document.title = "NexusChat";
	}, []);

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
					</div>
				</div>
				{isModalOpen && <AddServer closeModal={() => setIsModalOpen(false)}></AddServer>}
			</div>
		</ServerContext.Provider>
	);
}

export default App;
