import { useState } from "react";
import SmallHeading from "./SmallHeading";
import InputDefault from "./InputDefault";
import Upload from "../assets/upload";
import { useNavigate } from "react-router-dom";
import DefaultButton from "./DefaultButton";
import axios from "axios";

export default function AddServer({ closeModal }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedFile, setSelectedFile] = useState(false);
	const navigate = useNavigate();
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
	};

	const nextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const prevPage = () => {
		setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
	};

	const backdropClick = (e) => {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	};

	const createServer = async () => {
		const serverName = document.getElementById("serverNameInput").value;
		if (serverName === "") {
			return "";
		}
		try {
			const data = new FormData();
			data.append("name", serverName);
			data.append("img", selectedFile);
			data.append("isimageAppended", !selectedFile ? false : true);
			console.log(data);
			const response = await axios.post("https://localhost:3300/api/create", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			const res = response.data;
			navigate(`/${res.server_id}/${res.general_channel_id}`);
			closeModal();
		} catch (error) {
			console.error("Error sending data:", error.message);
		}
	};

	return (
		<div
			className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center flex-col min-h-0 pt-40 pb-40 bg-opacity-80 bg-black"
			onClick={backdropClick}
		>
			<div className="w-modal h-auto bg-gray-standard rounded-md z-50">
				{currentPage === 1 && (
					<div>
						<ModalHeaderSection
							heading="Create a server"
							description="Your server is where you and your friends hang out. Make yours and start talking."
							closeModal={closeModal}
						></ModalHeaderSection>

						<div className="pl-4 p-2 mt-6">
							<AddServerContentBox
								nextPage={nextPage}
								img="/img/addServer-own.svg"
								text="Create My Own"
							></AddServerContentBox>
							<SmallHeading img="/img/assServer-own.svg" text="start from a template"></SmallHeading>
							<AddServerContentBox
								nextPage={nextPage}
								img="/img/addServer-gaming.svg"
								text="Gaming"
							></AddServerContentBox>
							<AddServerContentBox
								nextPage={nextPage}
								img="/img/addServer-friends.svg"
								text="Friends"
							></AddServerContentBox>
							<AddServerContentBox
								nextPage={nextPage}
								img="/img/addServer-studygroup.svg"
								text="Study Group"
							></AddServerContentBox>
						</div>
						<Footer joinServerLink={setCurrentPage}></Footer>
					</div>
				)}
				{currentPage === 2 && (
					<div>
						<ModalHeaderSection
							heading="Customise your server"
							description="Give your new server a personality with a name and an icon. You can always change it later."
							closeModal={closeModal}
						></ModalHeaderSection>
						<div className="mt-4 mb-4  relative pl-4 pr-2">
							<div className="justify-center pt-1 flex">
								<div className="h-20 w-20 relative">
									{selectedFile && (
										<img
											alt="preview"
											className="rounded-[80px] h-20 w-20 text-white"
											src={URL.createObjectURL(selectedFile)}
										></img>
									)}
									{!selectedFile && <Upload></Upload>}
									<input
										accept=".jpg,.jpeg,.png,.gif"
										type="file"
										onChange={handleFileChange}
										tabIndex="0"
										className="absolute top-0 left-0 opacity-0 cursor-pointer h-full w-full"
									></input>
								</div>
							</div>
							<SmallHeading text="server name"></SmallHeading>
							<InputDefault initial_value="𝕾𝖈𝖍𝖑𝖊𝖎𝖒𝖋𝖗𝖊𝖘𝖘𝖊's server" id="serverNameInput"></InputDefault>
						</div>
						<Footer2 back={prevPage} create={createServer}></Footer2>
					</div>
				)}
				{currentPage === 3 && (
					<div>
						<ModalHeaderSection
							heading="Join a Server"
							description="Enter an invite below to join an existing server"
							closeModal={closeModal}
						></ModalHeaderSection>
						<div className="pr-2 pl-4">
							<SmallHeading text="invite link"></SmallHeading>
							<InputDefault placeholder="https://discord.gg/hTKzmak"></InputDefault>
							<div>
								<SmallHeading text="Invites should look like"></SmallHeading>
								<div className="leading-[18px] text-sm mb-4 text-gray-header-primary">
									<div>hTKzmak</div>
									<div>https://discord.gg/hTKzmak</div>
									<div>https://discord.gg/cool-people</div>
								</div>
							</div>
						</div>
						<Footer3 back={setCurrentPage}></Footer3>
					</div>
				)}
			</div>
		</div>
	);
}

const AddServerContentBox = ({ img, text, nextPage }) => {
	return (
		<button
			onClick={() => nextPage()}
			className="border border-solid border-gray-500-modifier bg-gray-standard mb-2 flex items-center cursor-pointer w-full p-0 appearance-none rounded-lg hover:bg-gray-500-background-modifier-hover"
		>
			<img className="m-2 ml-4 cursor-pointer" alt="" src={img}></img>
			<div className="text-base font-bold font-ggBold text-white">{text}</div>
			<img className="mr-4 ml-auto" alt="" src="/img/arrowright.svg"></img>
		</button>
	);
};

const ModalHeaderSection = ({ heading, description, closeModal }) => {
	return (
		<div className="p-6 pt-4 pb-0 flex flex-col flex-no-wrap justify-start items-center">
			<h1 className="text-2xl text-white font-ggSemibold font-bold">{heading}</h1>
			<div className="mt-2 text-gray-secondary text-center text-base font-ggNormal leading-5">
				{description}
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
	);
};

const Footer = ({ joinServerLink }) => {
	return (
		<div className="p-4 justify-between flex flex-col items-center bg-gray-700 rounded-md">
			<h2 className="bt-3 text-gray-header-primary mb-2 font-ggSemibold font-semibold text-xl leading-6">
				Already have an invite?
			</h2>
			<DefaultButton
				onClick={joinServerLink}
				parameter={3}
				text="Join a Server"
				color="bg-gray-button-secondary"
				colorHover="hover:bg-gray-button-secondary-hover"
			></DefaultButton>
		</div>
	);
};

const Footer2 = ({ back, create }) => {
	return (
		<div className="p-4 justify-between flex flex-row items-stretch bg-gray-700 rounded-md">
			<DefaultButton onClick={back} text="Back" color="bg-gray-button-secondary"></DefaultButton>
			<DefaultButton text="Create" onClick={create} color="bg-sky-600"></DefaultButton>
		</div>
	);
};

const Footer3 = ({ back }) => {
	return (
		<div className="p-4 justify-between flex flex-row items-stretch bg-gray-700 rounded-md">
			<DefaultButton
				onClick={back}
				parameter={1}
				text="Back"
				color="bg-gray-button-secondary"
			></DefaultButton>
			<DefaultButton text="Join Server" color="bg-sky-600"></DefaultButton>
		</div>
	);
};
