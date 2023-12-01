import "./index.css";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import AddServer from "./components/AddServer";
import DmSidebar from "./components/Second-Sidebar";

function App() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		document.title = "NexusChat";
	}, []);

	return (
		<div className="relative overflow-hidden w-full h-full flex bg-gray-standard">
			<SideBar openModal={() => setIsModalOpen(true)} isModalOpen={isModalOpen}></SideBar>
			<div className="relative flex-grow flex flex-col overflow-hidden ">
				<div className="flex items-stretch justify-start min-w-0 min-h-0 flex-1">
					<DmSidebar></DmSidebar>
				</div>
			</div>
			{isModalOpen && <AddServer closeModal={() => setIsModalOpen(false)}></AddServer>}
		</div>
	);
}

export default App;
