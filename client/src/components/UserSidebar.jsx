import { useEffect, useContext, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { serverContext } from "../Contexts";
import axios from "axios";

export default function UserSidebar() {
	const authUser = useAuthUser();
	const [serverMembers, setServerMembers] = useState([]);
	const { selectedServer, updateSelectedServer } = useContext(serverContext);

	useEffect(() => {
		if (selectedServer != null) {
			axios
				.get(`https://localhost:3300/api/${selectedServer}/members`)
				.then((res) => {
					console.log(res.data);
					setServerMembers(res.data);
				})
				.catch((err) => {
					console.error("Error fetching members", err);
				});
		}
	}, [selectedServer]);

	return (
		<div>
			<div className="flex flex-col h-full select-none">
				<aside className="flex justify-center min-w-[240px] relative max-h-full">
					<div className="overflow-hidden overflow-y-scroll px-0 w-[240px] py-0 pb-20 pr-0 flex-shrink-0 h-auto bg-gray-700 transparent-scrollbar relative box-border min-h-0">
						<RoleGroup group="online" members={serverMembers.length}></RoleGroup>
						{serverMembers != null &&
							serverMembers.map((member) => (
								<UserCard key={member.userId} name={member.displayName} img={member.img} />
							))}
					</div>
				</aside>
			</div>
		</div>
	);
}

const RoleGroup = ({ group, members }) => {
	return (
		<h3 className="h-16 pr-2 pl-4 pt-6 box-border overflow-hidden whitespace-nowrap text-ellipsis text-gray-channel uppercase text-xs leading-4 font-semibold tracking-wide font-ggNormal">
			{group} — {members}
		</h3>
	);
};

const UserCard = ({ name, img }) => {
	return (
		<div className="text-gray-channel relative max-w-[224px] mx-8 box-border block py-1 px-0 rounded transition-none">
			<div className="pt-[2px] pb-[2px] flex items-center rounded h-[42px] px-2">
				<img src={img} className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3" alt=""></img>
				<div>
					<div className="flex justify-center items-center text-base leading-5 font-ggMedium">{name}</div>
				</div>
			</div>
		</div>
	);
};
