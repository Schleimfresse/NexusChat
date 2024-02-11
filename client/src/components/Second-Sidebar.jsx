import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { VoiceChannelConnection } from "../VoiceChannelConnection.js";
import { serverContext } from "../Contexts.js";
import MicSVG from "../assets/mic.jsx";
import MutedMicSVG from "../assets/muted-mic.jsx";
import HeadsetSVG from "../assets/headset.jsx";
import DeafenSVG from "../assets/deafen.jsx";
import Settings from "../assets/settings.jsx";
import Speaker from "../assets/speaker";
import Hashtag from "../assets/hashtag";
import Handset from "../assets/handset.jsx";
import { useAuthUser } from "react-auth-kit";
import { WebsocketService } from "../websocketUtils.js";
import { SlArrowDown } from "react-icons/sl";
import { BsPlus } from "react-icons/bs";

export default function SecondSidebar() {
	const [channeldata, setChanneldata] = useState([]);
	const [fetchedChannelData, setFetchedChanneldata] = useState([]);
	const [activeChannel, setActiveChannel] = useState(null);
	const { selectedServer } = useContext(serverContext);
	const [isConnected, setConnected] = useState(false);
	const [channelId, setChannelId] = useState(null);
	const [voiceChannelInstance, setVoiceChannelInstance] = useState(undefined);

	useEffect(() => {
		if (selectedServer && !fetchedChannelData.includes(selectedServer)) {
			console.log(selectedServer);

			axios
				.get(`https://localhost:3300/api/${selectedServer}/channels`)
				.then((res) => {
					console.log(res);
					setChanneldata((alrFetchedChannelData) => [...alrFetchedChannelData, ...res.data]);
					console.log(channeldata);
				})
				.catch((err) => {
					console.error("Error fetching channel");
				});
			setFetchedChanneldata((prevServerId) => [...prevServerId, selectedServer]);
		}
	}, [selectedServer, channeldata, fetchedChannelData]); // may remove channeldata and fetchedServerData

	useEffect(() => {
		if (channelId !== null) {
			setVoiceChannelInstance((prevInstance) => {
				const newInstance = new VoiceChannelConnection();
				newInstance.connect(channelId);
				console.log("connecting");
				return newInstance;
			});
		}
	}, [channelId]);

	const handleTextChannelClick = (id) => {
		console.log(activeChannel);
		setActiveChannel(id);
	};

	const handleVoiceChannelClick = (id) => {
		setConnected(() => {
			setChannelId(id);
			return true;
		});
	};

	function Channel({ name, type, url, id }) {
		return (
			<li>
				<div className="ml-2 pt-[1px] pb-[1px]">
					<Link
						to={type === 1 && url}
						className={`relative flex items-center justify-center p-2 pt-[6px] pb-[6px] hover:bg-gray-500-background-modifier-hover text-gray-channel rounded ${
							activeChannel === id && type === 1 ? "bg-gray-channel-selected text-white" : ""
						}`}
						onClick={
							(type === 1 && (() => handleTextChannelClick(id))) ||
							(type === 2 && (() => handleVoiceChannelClick(id)))
						}
						data-channel-id={id}
					>
						<div className="relative flex items-center justify-center grow">
							<div className="mr-2">
								{type === 2 && <Speaker color="text-gray-channel"></Speaker>}
								{type === 1 && <Hashtag color="text-gray-channel"></Hashtag>}
							</div>
							<div className="overflow-hidden whitespace-nowrap overflow-ellipsis text-base leading-5 font-medium flex-1 font-ggMedium flex basis-auto grow shrink">
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
						style={{ "--image-url": `url(${avatar})` }}
						className={`w-6 h-6 flex-shrink-0 mx-8 border rounded-full bg-cover bg-no-repeat bg-center mt-[3px] mb-[3px] bg-[image:var(--image-url)]`}
					></div>
					<div className="text-base leading-5 font-medium flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
						{name}
					</div>
				</div>
			</div>
		);
	};

	const VoiceChannelMemberWrapper = () => {
		return <div className="pl-9 pb-2 flex flex-col flex-nowrap items-stretch justify-start"></div>;
	};

	const VoiceChannelConnectedPanel = () => {
		return (
			<div className="w-full h-10">
				<UserPanelButton
					clickfunc={() => {
						setConnected(false);
						setChannelId(null);
						voiceChannelInstance.disconnectFromVoiceChannel();
						setVoiceChannelInstance(null);
					}}
					svgIcon={<Handset></Handset>}
				></UserPanelButton>
			</div>
		);
	};

	const UserPanel = () => {
		const [muted, setMuted] = useState(false);
		const [deafen, setDeafen] = useState(false);

		const handleToggleMute = () => {
			setMuted((prevMuted) => !prevMuted);
			voiceChannelInstance.muteSender(muted);
			if (deafen) {
				setDeafen((prevDeafen) => !prevDeafen);
				voiceChannelInstance.muteReceivers(deafen);
			}

			//VoiceChannelConnection.applyPendingMutedState();
		};

		const handleToggleDeaf = () => {
			const newState = !deafen;
			setDeafen((prevDeafen) => !prevDeafen);
			setMuted(newState);

			voiceChannelInstance.muteSender(muted);
			voiceChannelInstance.muteReceivers(deafen);
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

	return (
		<div className="flex w-60 bg-gray-700 overflow-hidden flex-col min-h-0">
			<nav className="relative overflow-hidden select-none flex flex-col shrink grow basis-0">
				<ul className="overflow-x-hidden overflow-y-scroll transparent-scrollbar">
					{fetchedChannelData.map((serverId) => {
						const serverChannels = channeldata.filter((channel) => channel.serverId === serverId);
						const voiceChannelsArray = serverChannels.filter((channel) => channel.type === 2);
						const textChannelsArray = serverChannels.filter((channel) => channel.type === 1);

						return (
							selectedServer === serverId && (
								<React.Fragment key={serverId}>
								<ChannelGroup title={"voice channels"}></ChannelGroup>
									{voiceChannelsArray.map((channel, index) => (
										<Channel
											url={`/channels/${channel.serverId}/${channel.id}/`}
											name={channel.name}
											type={channel.type}
											id={channel.id}
											key={index}
											channel_server_id={channel.serverId}
										></Channel>
									))}

									<ChannelGroup title={"text channels"}></ChannelGroup>
									{textChannelsArray.map((channel, index) => (
										<Channel
											url={`/channels/${channel.serverId}/${channel.id}/`}
											name={channel.name}
											type={channel.type}
											id={channel.id}
											key={index}
											channel_server_id={channel.serverId}
										></Channel>
									))}
								</React.Fragment>
							)
						);
					})}
				</ul>
			</nav>
			{isConnected && voiceChannelInstance && <VoiceChannelConnectedPanel></VoiceChannelConnectedPanel>}
			<UserPanel></UserPanel>
		</div>
	);
}

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
					{auth_user().displayName}
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

const ChannelGroup = ({title}) => {
	return (
		<li draggable className="relative pt-4">
			<div className="cursor-pointer relative box-border h-6 pl-5 pr-2 flex items-center justify-between text-gray-channel hover:text-white">
				<div className="flex-1 overflow-hidden block">
					<h3 className="box-border text-ellipsis whitespace-nowrap overflow-hidden uppercase text-xs leading-4 tracking-[0.04em] font-ggSemibold font-semibold">
						<div className="">{title}</div>
					</h3>
					<SlArrowDown height={12} width={12} className="absolute left-[2px] top-[6px] w-3 h-3 overflow-hidden" />
				</div>
				<div className="flex items-center justify-center flex-shrink-0">
					<button className="p-0 px-2 border-dotted border-transparent w-[18px] h-[18px]"></button>
					<div>
						<BsPlus height={24} width={24}></BsPlus>
					</div>
				</div>
			</div>
		</li>
	);
};