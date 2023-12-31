import { Device } from "mediasoup-client";
import io from "socket.io-client";

export const handleVoiceChannelConnection = (channel_id) => {
	const roomName = channel_id;
	const socket = io("https://localhost:3300/mediasoup");

	socket.on("connection-success", ({ socketId }) => {
		console.log(socketId);
		getLocalStream();
	});

	let localVideo = document.getElementById("localVideo");
	let videoContainer = document.getElementById("videoContainer");
	let device;
	let rtpCapabilities;
	let producerTransport;
	let consumerTransports = [];
	let audioProducer;
	let videoProducer;
	//let consumer;
	//let isProducer = false;

	let params = {
		track: null,
		encodings: [
			{
				rid: "r0",
				maxBitrate: 100000,
				scalabilityMode: "S1T3",
			},
			{
				rid: "r1",
				maxBitrate: 300000,
				scalabilityMode: "S1T3",
			},
			{
				rid: "r2",
				maxBitrate: 900000,
				scalabilityMode: "S1T3",
			},
		],
		codecOptions: {
			videoGoogleStartBitrate: 1000,
		},
	};

	let audioParams;
	let videoParams = { params };
	let consumingTransports = [];

	const streamSuccess = (stream) => {
		localVideo.srcObject = stream;

		audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
		videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

		console.log(audioParams, videoParams);

		joinRoom();
	};

	const joinRoom = () => {
		socket.emit("joinRoom", { roomName }, (data) => {
			console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`);
			// we assign to local variable and will be used when
			// loading the client Device (see createDevice above)
			rtpCapabilities = data.rtpCapabilities;

			createDevice();
		});
	};

	const getLocalStream = () => {
		navigator.mediaDevices
			.getUserMedia({
				audio: true,
				video: {
					width: {
						min: 640,
						max: 1920,
					},
					height: {
						min: 400,
						max: 1080,
					},
				},
			})
			.then(streamSuccess)
			.catch((err) => console.log(err));
	};

	const createDevice = async () => {
		try {
			device = new Device();

			await device.load({
				routerRtpCapabilities: rtpCapabilities,
			});

			console.log("Device RTP Capabilities", device.rtpCapabilities);

			createSendTransport();
		} catch (error) {
			console.log(error);
			if (error.name === "UnsupportedError") console.warn("browser not supported");
		}
	};

	const createSendTransport = () => {
		socket.emit("createWebRtcTransport", { consumer: false }, ({ params }) => {
			if (params.error) {
				console.log(params.error);
				return;
			}

			console.log(params);

			producerTransport = device.createSendTransport(params);

			producerTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
				try {
					await socket.emit("transport-connect", {
						dtlsParameters,
					});

					callback();
				} catch (error) {
					errback(error);
				}
			});

			producerTransport.on("produce", async (parameters, callback, errback) => {
				console.log(parameters);

				try {
					await socket.emit(
						"transport-produce",
						{
							kind: parameters.kind,
							rtpParameters: parameters.rtpParameters,
							appData: parameters.appData,
						},
						({ id, producersExist }) => {
							callback({ id });

							if (producersExist) getProducers();
						}
					);
				} catch (error) {
					errback(error);
				}
			});

			connectSendTransport();
		});
	};

	const connectSendTransport = async () => {
		audioProducer = await producerTransport.produce(audioParams);
		videoProducer = await producerTransport.produce(videoParams);

		audioProducer.on("trackended", () => {
			console.log("audio track ended");

			// close audio track
		});

		audioProducer.on("transportclose", () => {
			console.log("audio transport ended");

			// close audio track
		});

		videoProducer.on("trackended", () => {
			console.log("video track ended");

			// close video track
		});

		videoProducer.on("transportclose", () => {
			console.log("video transport ended");

			// close video track
		});
	};

	const signalNewConsumerTransport = async (remoteProducerId) => {
		//check if we are already consuming the remoteProducerId
		if (consumingTransports.includes(remoteProducerId)) return;
		consumingTransports.push(remoteProducerId);

		await socket.emit("createWebRtcTransport", { consumer: true }, ({ params }) => {
			if (params.error) {
				console.log(params.error);
				return;
			}
			console.log(`PARAMS... ${params}`);

			let consumerTransport;
			try {
				consumerTransport = device.createRecvTransport(params);
			} catch (error) {
				console.log(error);
				return;
			}

			consumerTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
				try {
					await socket.emit("transport-recv-connect", {
						dtlsParameters,
						serverConsumerTransportId: params.id,
					});

					callback();
				} catch (error) {
					errback(error);
				}
			});

			connectRecvTransport(consumerTransport, remoteProducerId, params.id);
		});
	};

	// server informs the client of a new producer just joined
	socket.on("new-producer", ({ producerId }) => signalNewConsumerTransport(producerId));

	const getProducers = () => {
		socket.emit("getProducers", (producerIds) => {
			console.log(producerIds);
			// for each of the producer create a consumer
			// producerIds.forEach(id => signalNewConsumerTransport(id))
			producerIds.forEach(signalNewConsumerTransport);
		});
	};

	const connectRecvTransport = async (consumerTransport, remoteProducerId, serverConsumerTransportId) => {
		await socket.emit(
			"consume",
			{
				rtpCapabilities: device.rtpCapabilities,
				remoteProducerId,
				serverConsumerTransportId,
			},
			async ({ params }) => {
				if (params.error) {
					console.log("Cannot Consume");
					return;
				}

				console.log(`Consumer Params`, params);
				// then consume with the local consumer transport
				// which creates a consumer
				const consumer = await consumerTransport.consume({
					id: params.id,
					producerId: params.producerId,
					kind: params.kind,
					rtpParameters: params.rtpParameters,
				});

				consumerTransports = [
					...consumerTransports,
					{
						consumerTransport,
						serverConsumerTransportId: params.id,
						producerId: remoteProducerId,
						consumer,
					},
				];

				const newElem = document.createElement("div");
				newElem.setAttribute("id", `td-${remoteProducerId}`);

				if (params.kind === "audio") {
					newElem.innerHTML = '<audio id="' + remoteProducerId + '" autoPlay></audio>';
				} else {
					newElem.setAttribute("class", "remoteVideo h-40 w-60");
					newElem.innerHTML = '<video id="' + remoteProducerId + '" autoPlay" ></video>';
				}

				videoContainer.appendChild(newElem);

				const { track } = consumer;

				console.log("REMOTE PRODUCER ID", document.getElementById(remoteProducerId));

				document.getElementById(remoteProducerId).srcObject = new MediaStream([track]);

				// the server consumer started with media paused
				// so we need to inform the server to resume
				socket.emit("consumer-resume", { serverConsumerId: params.serverConsumerId });
			}
		);
	};

	socket.on("producer-closed", ({ remoteProducerId }) => {
		// server notification is received when a producer is closed
		// we need to close the client-side consumer and associated transport
		const producerToClose = consumerTransports.find(
			(transportData) => transportData.producerId === remoteProducerId
		);
		producerToClose.consumerTransport.close();
		producerToClose.consumer.close();

		// remove the consumer transport from the list
		consumerTransports = consumerTransports.filter(
			(transportData) => transportData.producerId !== remoteProducerId
		);

		// remove the video div element
		videoContainer.removeChild(document.getElementById(`td-${remoteProducerId}`));
	});
};
