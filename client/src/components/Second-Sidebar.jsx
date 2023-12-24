import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { handleVoiceChannelConnection } from "../mediasoup.js";
import { ServerContext } from "../ServerContext";
import MicSVG from "../assets/mic.jsx";
import MutedMicSVG from "../assets/muted-mic.jsx";
import HeadsetSVG from "../assets/headset.jsx";
import DeafenSVG from "../assets/deafen.jsx";
import Settings from "../assets/settings.jsx";
import Speaker from "../assets/speaker";
import Hashtag from "../assets/hashtag";
import { useAuthUser } from "react-auth-kit";

export default function SecondSidebar() {
	const [channeldata, setChanneldata] = useState([]);
	const [fetchedServerData, setFetchedServerdata] = useState([]);
	const [activeChannel, setActiveChannel] = useState(null);
	const { selectedServer, updateSelectedServer } = useContext(ServerContext);

	useEffect(() => {
		if (!fetchedServerData.includes(selectedServer)) {
			axios
				.get(`https://localhost:3300/api/servers/${selectedServer}/channels`)
				.then((res) => {
					setChanneldata((alrFetchedChannelData) => [...alrFetchedChannelData, ...res.data]);
				})
				.catch((err) => {
					console.error("Error fetching channel");
				});
			setFetchedServerdata((prevServerId) => [...prevServerId, selectedServer]);
		}
	}, [selectedServer]);

	const handleChannelClick = (id) => {
		console.log(activeChannel);
		setActiveChannel(id);
	};

	function Channel({ name, type, url, id, channel_server_id }) {
		return (
			<li>
				<div className="ml-2 pt-[1px] pb-[1px]">
					<Link
						to={type === 1 && url}
						className={`relative flex items-center justify-center p-2 pt-[7px] pb-[7px] hover:bg-gray-500-background-modifier-hover rounded ${
							activeChannel === id && type === 1 ? "bg-gray-channel-selected" : ""
						}`}
						onClick={
							(type === 1 && (() => handleChannelClick(id))) ||
							(type === 2 && (() => handleVoiceChannelConnection(id)))
						}
						data-channel-id={id}
					>
						<div className="relative flex items-center justify-center grow">
							<div className="mr-2">
								{type === 2 && <Speaker color="text-gray-channel"></Speaker>}
								{type === 1 && <Hashtag color="text-gray-channel"></Hashtag>}
							</div>
							<div className="overflow-hidden whitespace-nowrap overflow-ellipsis text-base leading-5 font-medium flex-1 font-ggMedium text-gray-channel flex basis-auto grow shrink">
								{name}
							</div>
						</div>
					</Link>
				</div>
			</li>
		);
	}

	const VoiceChannelUserBox = (avatar, name) => {
		return (
			<div>
				<div className="mt-[1px] mb-[1px] flex items-center justify-start rounded-md">
					<div
						className={`w-6 h-6 flex-shrink-0 mx-8 border rounded-full bg-cover bg-no-repeat bg-center mt-[3px] mb-[3px] bg-[url(${avatar})]`}
					></div>
					<div className="text-base leading-5 font-medium flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
						{name}
					</div>
				</div>
			</div>
		);
	};

	const VoiceChannelMemberWrapper = () => {
		return (
			<div className="pl-9 pb-2 flex flex-col flex-nowrap items-stretch justify-start">
				
			</div>
		)
	}

	return (
		<div className="flex w-60 bg-gray-700 overflow-hidden flex-col min-h-0">
			<nav className="relative overflow-hidden select-none flex flex-col shrink grow basis-0">
				<ul className="overflow-x-hidden overflow-y-scroll transparent-scrollbar">
					{channeldata.map(
						(channel, index) =>
							selectedServer === channel.server_id && (
								<Channel
									url={`/channels/${channel.server_id}/${channel.channel_id}/`}
									name={channel.channel_name}
									type={channel.type}
									id={channel.channel_id}
									channel_server_id={channel.server_id}
								></Channel>
							)
					)}
				</ul>
			</nav>
			<UserPanel></UserPanel>
		</div>
	);
}

const UserPanel = () => {
	const [muted, setMuted] = useState(false);
	const [deafen, setDeafen] = useState(false);

	const handleToggleMute = () => {
		setMuted((prevMuted) => !prevMuted);
	};

	const handleToggleDeaf = () => {
		const newState = !deafen;
		setDeafen(newState);
		setMuted(newState);
	};

	const MicIcon = muted ? <MutedMicSVG></MutedMicSVG> : <MicSVG></MicSVG>;
	const DeafIcon = deafen ? <DeafenSVG></DeafenSVG> : <HeadsetSVG></HeadsetSVG>;

	return (
		<div className="bg-gray-800 h-14 text-base font-medium flex items-center px-2 flex-shrink-0 flex-grow-0">
			<UserAvatarWrapper></UserAvatarWrapper>
			<div className="flex-shrink-0 flex-grow-1 flex flex-nowrap items-stretch justify-start">
				<UserPanelButton svgIcon={MicIcon} clickfunc={handleToggleMute}></UserPanelButton>
				<UserPanelButton svgIcon={DeafIcon} clickfunc={handleToggleDeaf}></UserPanelButton>
				<UserPanelButton svgIcon={<Settings></Settings>}></UserPanelButton>
			</div>
		</div>
	);
};

const UserPanelButton = ({ svgIcon, clickfunc }) => {
	return (
		<button
			onClick={clickfunc}
			className="cursor-pointer leading-0 w-8 h-8 flex items-center justify-center rounded-md relative hover:bg-gray-500-background-modifier-hover"
		>
			<div>{svgIcon}</div>
		</button>
	);
};

const UserAvatarWrapper = () => {
	const auth_user = useAuthUser();
	const [isHovered, setIsHovered] = useState(false);

	const handleHover = () => {
		setIsHovered(true);
	};

	const handleLeave = () => {
		setIsHovered(false);
	};

	return (
		<div
			className="flex items-center ml-[-2px] min-w-[120px] pl-[2px] mr-2 hover:rounded hover:bg-gray-500-background-modifier-hover hover:text-gray-interactive"
			onMouseEnter={handleHover}
			onMouseLeave={handleLeave}
		>
			<div className="w-8 h-8 flex-shrink-0 cursor-pointer relative rounded-full bg-slate-600"></div>
			<div className="pb-1 pl-2 pt-1 cursor-pointer select-text flex-grow-1 mr-1 min-w-0">
				<div className="text-sm font-ggNormal leading-[18px] font-normal whitespace-nowrap overflow-hidden overflow-ellipsis text-white">
					{auth_user().alias}
				</div>
				<div className="text-xs font-ggNormal leading-4 font-normal whitespace-nowrap overflow-hidden overflow-ellipsis text-gray-header-secondary">
					<div className="inline-block align-top cursor-default text-left box-border relative w-full contain-paint select-none">
						<div
							className={`whitespace-nowrap overflow-hidden overflow-ellipsis block transition-all duration-[220ms] ease-in-out transform-style-3d pointer-events-none w-full ${
								isHovered ? " translate-y-[-107%] opacity-0 select-none" : ""
							}`}
						>
							<div className="overflow-hidden text-ellipsis flex">
								<img alt="" src="/img/thumb-right.svg" className="mr-1 w-3.5 h-3.5"></img>
								<span>We chillin</span>
							</div>
						</div>
						<div
							className={`opacity-0 translate-y-[107%] absolute inset-0 whitespace-nowrap overflow-hidden block transition-all duration-[220ms] ease transform-style-3d pointer-events-none w-full ${
								isHovered ? "translate-z-0 opacity-100" : ""
							}`}
						>
							{auth_user().username}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
