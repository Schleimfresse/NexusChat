import "./index.css";
import SideBar from "./components/SideBar";
import { useEffect, useRef, useState } from "react";
import AddServer from "./components/AddServer";
import SecondSidebar from "./components/Second-Sidebar";
import { ServerContext } from "./ServerContext";
import { Device } from "mediasoup-client";
import io from "socket.io-client";

function App() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedServer, setSelectedServer] = useState(null);
	const init = useRef(false);
	const updateSelectedServer = (server) => {
		setSelectedServer(server);
	};

	///////////////////////////////////////////////////////////
	// Socket /////////////////////////////////////////////////
	///////////////////////////////////////////////////////////

	const device = useRef(null);
	const producer = useRef(null);
	const Audio_element = document.getElementById("audio_element");

	useEffect(() => {
		if (init.current) return;
		init.current = true;
		document.title = "NexusChat";

		const socket = io("http://localhost:3300");

		console.log("getRouterRtpCapabilities");
		socket.emit("message", { type: "getRouterRtpCapabilities" });

		socket.on("message", (msg) => {
			switch (msg.type) {
				case "routerCapabilities":
					onRouterCapabilities(msg);
					break;
				case "producerTransportCreated":
					onProducerTransportCreated(msg);
					break;
				default:
					break;
			}
		});

		document.getElementById("event_btn").addEventListener("click", () => {
			socket.emit("message", {
				type: "createProducerTransport",
				forceTcp: false,
				rtpCapabilities: device.current.rtpCapabilities,
			});
		});

		const onProducerTransportCreated = async (msg) => {
			if (msg.error) {
				console.error("producer transport create error", msg.error);
				return;
			}

			console.log(device.current);

			const transport = device.current.createSendTransport(msg.data);

			transport.on("connect", async ({ dtlsParameters }, callback, errcallback) => {
				const message = {
					type: "connectProducerTransport",
					dtlsParameters,
				};

				socket.emit("message", message);
				socket.on("message", (msg) => {
					if (msg.type === "producerConnected") {
						console.log("producer Connected");
						callback();
					}
				});
			});

			// begin transport on producer
			transport.on("produce", async ({ kind, rtpParameters }, callback, errcallback) => {
				const message = {
					type: "produce",
					transportId: transport.id,
					kind,
					rtpParameters,
				};
				socket.emit("message", message);
				socket.on("published", (msg) => {
					callback(msg.id);
				});
			});
			// end transport producer

			// conneciton state change begin
			transport.on("connectionStateChange", (state) => {
				switch (state) {
					case "connecting":
						document.getElementById("textPublish").innerHTML = "publishing...";
						break;
					case "connected":
						document.getElementById("textPublish").innerHTML = "published";
						Audio_element.srcObject = stream;
						break;
					case "failed":
						transport.close();
						document.getElementById("textPublish").innerHTML = "failed";
						break;
					default:
						break;
				}
			});
			// conneciton state change end

			let stream;
			try {
				console.log("GET STREAM");
				stream = await getUserMedia(transport);
				console.log(stream);
				const track = stream.getAudioTracks()[0];
				const params = { track };
				console.log(transport);
				producer.current = await transport.produce(params);
			} catch (err) {
				console.error(err);
				document.getElementById("textPublish").innerHTML = "failed";
			}
		};

		const onRouterCapabilities = async (msg) => {
			await loadDevice(msg.data);
		};

		const loadDevice = async (routerRtpCapabilities) => {
			try {
				device.current = new Device();
			} catch (err) {
				if (err.name === "UnsupportedError") {
					console.log("Browser not supported");
				}
			}
			await device.current.load({ routerRtpCapabilities });
			setIsDeviceLoaded(true);
		};

		const getUserMedia = async (transport) => {
			if (!device.current.canProduce("audio")) {
				console.error("cannot produce audio");
				return;
			}

			let stream;
			try {
				stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
			} catch (err) {
				console.error(err);
				throw err;
			}
			return stream;
		};
	}, []);
	const [isDeviceLoaded, setIsDeviceLoaded] = useState(false);

	useEffect(() => {
		if (device.current && isDeviceLoaded) {
			console.log("Device is loaded and can be used now:", device.current);
		}
	}, [isDeviceLoaded]);

	return (
		<ServerContext.Provider value={{ selectedServer, updateSelectedServer }}>
			<div className="relative overflow-hidden w-full h-full flex bg-gray-standard text-rendering">
				<SideBar openModal={() => setIsModalOpen(true)} isModalOpen={isModalOpen}></SideBar>
				<div className="relative flex-grow flex flex-col overflow-hidden ">
					<div className="flex items-stretch justify-start min-w-0 min-h-0 flex-1">
						<SecondSidebar></SecondSidebar>
						<button id="event_btn">CLICK TO CREATE transport over mediasoup</button>
						<audio id="audio_element" />
						<div id="textPublish"></div>
					</div>
				</div>
				{isModalOpen && <AddServer closeModal={() => setIsModalOpen(false)}></AddServer>}
			</div>
		</ServerContext.Provider>
	);
}

export default App;
