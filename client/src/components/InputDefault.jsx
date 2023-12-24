import { useState } from "react";

export default function InputDefault({ initial_value, placeholder, id, type }) {
	const [value, setValue] = useState(initial_value);

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	return (
		<input
			className="p-2.5 h-10 rounded border-none w-full font-normal bg-gray-input-background outline-none placeholder:text-gray-input-placeholder text-gray-input-text font-ggNormal"
			value={value}
			maxLength="100"
			onChange={handleChange}
			placeholder={placeholder}
			id={id}
			type={type}
		></input>
	);
}
