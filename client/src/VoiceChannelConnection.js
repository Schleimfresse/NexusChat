export class VoiceChannelConnection {
	static localVideo;
	static peerConnection;
	static socketId = null;
	static channelId = null;
	static connected = false;
	static socket = { send: null, close: null, onmessage: null };

	constructor() {
		VoiceChannelConnection.localVideo = document.getElementById("localVideo");
		VoiceChannelConnection.participantsList = document.getElementById("videoContainer");
	}

	connect(channelId) {
		VoiceChannelConnection.channelId = channelId;
		console.log(VoiceChannelConnection.socket);
		VoiceChannelConnection.socket = new WebSocket("wss://localhost:3300/wss", "wss");
		console.log(VoiceChannelConnection.socket);
		VoiceChannelConnection.socket.onmessage = (event) => VoiceChannelConnection.handleMessage(event);
	}

	static handleMessage(event) {
		const message = JSON.parse(event.data);
		console.log("WSS message:", message);
		VoiceChannelConnection.handleSocketMessage(message);
	}

	static sendSocketMessage(type, data) {
		VoiceChannelConnection.socket.send(JSON.stringify({ type, data }));
	}

	static handleSocketMessage(message) {
		switch (message.type) {
			case "connection-success":
				VoiceChannelConnection.socketId = message.data.socketId;
				VoiceChannelConnection.connected = true;
				VoiceChannelConnection.joinChannel();
				break;
			case "joinedChannel":
				VoiceChannelConnection.createOffer();
				break;
			case "ice-candidate":
				VoiceChannelConnection.handleIceCandidate(message.data.candidate);
				break;
			case "answer":
				VoiceChannelConnection.handleAnswer(message.data.answer);
				break;
			default:
				break;
		}
	}

	static joinChannel() {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: { noiseSuppression: true } })
			.then((stream) => {
				console.log(VoiceChannelConnection.localVideo);
				VoiceChannelConnection.localVideo.srcObject = stream;
				VoiceChannelConnection.createPeerConnection();
				console.log(VoiceChannelConnection.peerConnection);
				VoiceChannelConnection.peerConnection.addTrack(stream.getVideoTracks()[0], stream);
				VoiceChannelConnection.peerConnection.addTrack(stream.getAudioTracks()[0], stream);
			})
			.catch((error) => {
				console.error("Error accessing media devices:", error);
			});
	}

	static createOffer() {
		VoiceChannelConnection.peerConnection
			.createOffer()
			.then((offer) => VoiceChannelConnection.peerConnection.setLocalDescription(offer))
			.then(() => {
				VoiceChannelConnection.sendSocketMessage("offer", {
					offer: VoiceChannelConnection.peerConnection.localDescription,
					channelId: VoiceChannelConnection.channelId,
					socketId: VoiceChannelConnection.socketId,
				});
			})
			.catch((error) => console.error(error));
	}

	static createPeerConnection() {
		const configuration = {
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
			iceCandidatePoolSize: 10,
		};

		VoiceChannelConnection.peerConnection = new RTCPeerConnection(configuration);
		VoiceChannelConnection.peerConnection.getReceivers();
		VoiceChannelConnection.sendSocketMessage("joinChannel", { channelId: VoiceChannelConnection.channelId, socketId: VoiceChannelConnection.socketId });

		// Handle remote ICE candidates
		VoiceChannelConnection.peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				console.log("onice-candidate", {
					candidate: event.candidate,
					channelId: VoiceChannelConnection.channelId,
					socketId: VoiceChannelConnection.socketId,
				});
				VoiceChannelConnection.sendSocketMessage("ice-candidate", {
					candidate: event.candidate,
					channelId: VoiceChannelConnection.channelId,
					socketId: VoiceChannelConnection.socketId,
				});
			}
		};

		VoiceChannelConnection.peerConnection.ontrack = (event) => {
			const remoteVideo = document.createElement("video");
			remoteVideo.srcObject = event.streams[0];
			remoteVideo.autoplay = true;
			VoiceChannelConnection.participantsList.appendChild(remoteVideo);
		};
	}

	static handleIceCandidate(candidate) {
		const rtcIceCandidate = new RTCIceCandidate(candidate);
		VoiceChannelConnection.peerConnection
			.addIceCandidate(rtcIceCandidate)
			.then(() => {
				console.log("ICE candidate added successfully");
			})
			.catch((error) => {
				console.error("Error adding ICE candidate:", error);
			});
	}

	static handleAnswer(answer) {
		const rtcSessionDescription = new RTCSessionDescription(answer);
		VoiceChannelConnection.peerConnection
			.setRemoteDescription(rtcSessionDescription)
			.then(() => {
				console.log("Remote description set successfully");
			})
			.catch((error) => {
				console.error("Error setting remote description:", error);
			});
	}

	muteSender(state) {
		const audioSender = VoiceChannelConnection.peerConnection.getSenders().find((sender) => sender.track.kind === "audio");
		const audioTrack = audioSender.track;
		const newAudioTrack = audioTrack.clone();
		newAudioTrack.enabled = state;
		console.log(state, newAudioTrack, audioSender);
		audioSender.replaceTrack(newAudioTrack);
	}

	muteReceivers(state) {
		const audioReceiver = VoiceChannelConnection.peerConnection
			.getReceivers()
			.find((receiver) => receiver.track.kind === "audio");
		audioReceiver.track.enabled = state;
	}

	disconnectFromVoiceChannel() {
		VoiceChannelConnection.peerConnection.close();
		VoiceChannelConnection.sendSocketMessage("disconnect", { socketId: VoiceChannelConnection.socketId, channelId: VoiceChannelConnection.channelId });
		VoiceChannelConnection.socket.close();
		VoiceChannelConnection.connected = false;
	}
}
