import { useState } from "react";
import MicSVG from "../assets/mic.jsx";
import MutedMicSVG from "../assets/muted-mic.jsx";
import HeadsetSVG from "../assets/headset.jsx";
import DeafenSVG from "../assets/deafen.jsx";
import Settings from "../assets/settings.jsx"

export default function SecondSidebar() {
	return (
		<div className="flex w-60 bg-gray-700 overflow-hidden flex-col min-h-0">
			<nav className="relative overflow-hidden select-none flex flex-col shrink grow basis-0"></nav>
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
		setDeafen((prevDeafen) => !prevDeafen);
	};

	const MicIcon = muted ? <MutedMicSVG></MutedMicSVG> : <MicSVG></MicSVG>;
	const DeafIcon = deafen ? <DeafenSVG></DeafenSVG> : <HeadsetSVG></HeadsetSVG>;

	return (
		<div className="bg-gray-800 h-14 text-base font-medium flex items-center px-8 flex-shrink-0 flex-grow-0">
			<div className="flex items-center ml-[-2px] min-w-[120px] pl-[2px]"></div>
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
