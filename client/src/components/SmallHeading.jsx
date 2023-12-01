import React from "react";

export default function SmallHeading({ text }) {
	text = text.toUpperCase();
	return <div className="mt-4 mb-2 text-xs text-gray-secondary font-ggBold font-bold">{text}</div>;
}
