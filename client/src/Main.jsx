import SideBar from "./components/SideBar";
import { useState } from "react";
import AddServer from "./components/AddServer";
import SecondSidebar from "./components/Second-Sidebar";
import { serverContext, serverDataContext } from "./Contexts";
import { WebsocketService } from "./websocketUtils";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";
import UserSidebar from "./components/UserSidebar";

export default function Main() {
	const authUser = useAuthUser();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [serverdata, setServerdata] = useState([]);
	const [selectedServer, setSelectedServer] = useState(null);
	const updateSelectedServer = (server) => {
		setSelectedServer(server);
	};

	const updateServerData = (data) => {
		setServerdata((prevData) => [...prevData.concat(data)]);
	};

	const createInvite = () => {
		axios
			.post(
				"https://localhost:3300/api/create/invitelink",
				{ serverId: "4240156173408901080" },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				console.log(res);
			});
	};

	WebsocketService.connect(authUser().userId);

	return (
		<serverContext.Provider value={{ selectedServer, updateSelectedServer }}>
			<serverDataContext.Provider value={{ serverdata, updateServerData }}>
				<div className="relative overflow-hidden w-full h-full flex bg-gray-standard text-rendering">
					<SideBar
						openModal={() => setIsModalOpen(true)}
						isModalOpen={isModalOpen}
						serverdata={serverdata}
						setServerdata={setServerdata}
					></SideBar>
					<div className="relative flex-grow flex flex-col overflow-hidden ">
						<div className="flex items-stretch justify-start min-w-0 min-h-0 flex-1" id="content">
							<SecondSidebar></SecondSidebar>
							<div id="chat">
								<div id="videoContainer"></div>
							</div>
						</div>
					</div>
					<button onClick={createInvite}>Create invite link</button>
					<UserSidebar></UserSidebar>
					{isModalOpen && (
						<AddServer
							setServerdata={setServerdata}
							serverdata={serverdata}
							closeModal={() => setIsModalOpen(false)}
						></AddServer>
					)}
				</div>
			</serverDataContext.Provider>
		</serverContext.Provider>
	);
}
