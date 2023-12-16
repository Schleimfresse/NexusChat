import { config } from "../../config/config.js";

export const createWebRtcTransport = async (router) => {
	return new Promise(async (resolve, reject) => {
		try {
			let transport = await router.createWebRtcTransport(config.mediasoup.webRtcTransport);
			console.log(`transport id: ${transport.id}`);

			transport.on("dtlsstatechange", (dtlsState) => {
				if (dtlsState === "closed") {
					transport.close();
				}
				if (dtlsState === "connected") {
					console.log("Client connected");
				}
			});

			transport.on("close", () => {
				console.log("transport closed");
			});

			resolve(transport);
		} catch (error) {
			reject(error);
		}
	});
};
