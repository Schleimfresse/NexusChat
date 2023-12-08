import { config } from "../config/config.js";

const createWebRtcTransport = async (mediasoupRouter) => {
	const { maxIncomeBitrate, initialAvailableOutgoingBitrate } = config.mediasoup.webRtcTransport;

	const transport = await mediasoupRouter.createWebRtcTransport({
		listenIps: config.mediasoup.webRtcTransport.listenIps,
		enableUdp: true,
		enableTcp: true,
		preferUdp: true,
		initialAvailableOutgoingBitrate,
		iceServers: config.mediasoup.webRtcTransport.iceServers,
	});

	if (maxIncomeBitrate) {
		try {
			await transport.setMaxIncomingBitrate(maxIncomeBitrate);
		} catch (err) {
			console.error(err);
		}
	}

	return {
		transport,
		params: {
			id: transport.id,
			iceParameters: transport.iceParameters,
			iceCandidates: transport.iceCandidates,
			dtlsParameters: transport.dtlsParameters,
		},
	};
};

export { createWebRtcTransport };
