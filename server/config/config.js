import os from "os";

export const config = {
	listenIp: "0.0.0.0",
	listenPort: 3016,

	mediasoup: {
		numWorkers: Object.keys(os.cpus()).length,
		worker: {
			rtcMinPort: 10000,
			rtcMaxPort: 10100,
			logLevel: "debug",
			logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
		},
		router: {
			mediaCodecs: [{ kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 }],
		},
		webRtcTransport: {
			listenIps: [
				{
					ip: "0.0.0.0",
					announcedIp: "127.0.0.1",
				},
			],
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
			maxIncomeBitrate: 3072000,
			initialAvailableOutgoingBitrate: 1000000,
		},
	},
};
