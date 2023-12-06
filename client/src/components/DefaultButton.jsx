import React from "react";

export default function DefaultButton({ text, color, onClick, parameter, colorHover }) {
	return (
		<button
			onClick={(onClick && parameter && (() => onClick(parameter))) || (onClick && (() => onClick()))}
			className={`text-white flex justify-center self-stretch font-medium items-center h-9 relative border-none ease-in-out duration-200 text-sm select-none w-auto rounded pt-1 pb-1 pl-4 pr-4 font-ggMedium ${color} ${colorHover}`}
		>
			<div className="ml-auto mr-auto h-4 leading-4">{text}</div>
		</button>
	);
}
