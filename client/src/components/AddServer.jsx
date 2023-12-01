import React from "react";
import SmallHeading from "./SmallHeading";

export default function AddServer({ closeModal }) {
	return (
		<div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center flex-col min-h-0 pt-40 pb-40 bg-opacity-80 bg-black">
			<div className="w-modal h-modal bg-gray-700 rounded-md">
				<div className="p-6 pt-4 pb-0 flex flex-col flex-no-wrap justify-start items-center">
					<h1 className="text-2xl text-white font-ggSemibold font-bold">Create a server</h1>
					<div className="mt-2 text-white text-center text-base font-ggNormal leading-5">
						Your server is where you and your friends hang out. Make yours and start talking.
					</div>
					<button className="top-3 right-3 absolute" onClick={closeModal}>
						<svg
							className="text-gray-500"
							aria-hidden="true"
							role="img"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
							></path>
						</svg>
					</button>
				</div>
				<div className="pl-4 p-2 mt-6">
					<AddServerContentBox img="/img/addServer-own.svg" text="Create My Own"></AddServerContentBox>
					<SmallHeading img="/img/assServer-own.svg" text="start from a template"></SmallHeading>
					<AddServerContentBox img="/img/addServer-gaming.svg" text="Gaming"></AddServerContentBox>
					<AddServerContentBox img="/img/addServer-friends.svg" text="Friends"></AddServerContentBox>
					<AddServerContentBox img="/img/addServer-studygroup.svg" text="Study Group"></AddServerContentBox>
				</div>
			</div>
		</div>
	);
}

const AddServerContentBox = ({ img, text }) => {
	return (
		<button className="border border-solid border-gray-500-modifier bg-gray-700 mb-2 flex items-center cursor-pointer w-full p-0 appearance-none rounded-lg hover:bg-gray-500-background-modifier-hover">
			<img className="m-2 ml-4 cursor-pointer" alt="" src={img}></img>
			<div className="text-base font-bold font-ggBold text-white">{text}</div>
			<img className="mr-4 ml-auto" alt="" src="/img/arrowright.svg"></img>
		</button>
	);
};
