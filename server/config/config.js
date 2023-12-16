import os from "os";

export const config = {
	listenInfo: { protocol: "udp", ip: "127.0.0.1" },
	listenPort: 3016,

	mediasoup: {
		numWorkers: Object.keys(os.cpus()).length,
		worker: {
			rtcMinPort: 10000,
			rtcMaxPort: 59999,
			logLevel: "debug",
			logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
		},
		router: {
			mediaCodecs: [
				{
					kind: "audio",
					mimeType: "audio/opus",
					clockRate: 48000,
					channels: 2,
				},
				{
					kind: "video",
					mimeType: "video/VP8",
					clockRate: 90000,
					parameters: {
						"x-google-start-bitrate": 1000,
					},
				},
			],
		},
		webRtcTransport: {
			listenInfos: [
				{
					protocol: "udp",
					ip: "192.168.1.118",
					//port: 20000,
				},
				{
					protocol: "tcp",
					ip: "192.168.1.118",
					//port: 20000,
				},
			],

			maxIncomeBitrate: 3072000,
			initialAvailableOutgoingBitrate: 1000000,
			enableUdp: true,
			enableTcp: true,
			preferUdp: true,
		},
	},
};
