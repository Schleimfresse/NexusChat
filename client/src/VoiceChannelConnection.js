export class VoiceChannelConnection {
	static localVideo;
	static participantsList;
	static peerConnection;
	static socketId = null;
	static channelId = null;
	static socket = WebSocket;
	static joinAudio = new Audio("/audio/join.mp3");
	//static pendingMutedState = false;

	constructor() {
		VoiceChannelConnection.localVideo = document.createElement("video");
		VoiceChannelConnection.participantsList = document.getElementById("videoContainer");
	}

	/*static applyPendingMutedState() {
		if (VoiceChannelConnection.pendingMutedState && VoiceChannelConnection.peerConnection) {
			this.muteSender(VoiceChannelConnection.pendingMutedState);
			VoiceChannelConnection.pendingMutedState = false;
		}
	}*/

	setUpLocalVideoNode() {
		VoiceChannelConnection.localVideo.setAttribute("class", "h-40 w-60");
		VoiceChannelConnection.localVideo.muted = true;
		VoiceChannelConnection.localVideo.autoplay = true;
		VoiceChannelConnection.localVideo.setAttribute("id", "localVideo");

		document.getElementById("chat").appendChild(VoiceChannelConnection.localVideo);
	}

	connect(channelId) {
		console.log(channelId,"CHANNEL");
		VoiceChannelConnection.joinAudio.play();
		this.setUpLocalVideoNode();
		VoiceChannelConnection.channelId = channelId;
		VoiceChannelConnection.socket = new WebSocket("wss://localhost:3300/webrtc", "wss");
		console.log(VoiceChannelConnection.socket);
		VoiceChannelConnection.socket.onmessage = (event) => VoiceChannelConnection.handleMessage(event);
	}

	static handleMessage(event) {
		const message = JSON.parse(event.data);
		console.log("WSS message:", message);
		this.handleSocketMessage(message);
	}

	static sendSocketMessage(type, data) {
		console.log("SENDING", type, ": ", data);
		this.socket.send(JSON.stringify({ type, data }));
	}

	static handleSocketMessage(message) {
		switch (message.type) {
			case "connection-success":
				this.socketId = message.data.socketId;
				this.joinChannel();
				break;
			case "joinedChannel":
				this.createOffer();
				break;
			case "ice-candidate":
				this.handleIceCandidate(message.data.candidate);
				break;
			case "answer":
				this.handleAnswer(message.data.answer);
				break;
			default:
				break;
		}
	}

	static addAudio(stream) {
		const audioTrack = stream.getAudioTracks()[0];
		VoiceChannelConnection.peerConnection.addTrack(audioTrack, stream);
	}

		static addVideo(stream) {
		VoiceChannelConnection.localVideo.srcObject = stream;
		const videoTrack = stream.getVideoTracks()[0];
		VoiceChannelConnection.peerConnection.addTrack(videoTrack, stream);
	}

	static joinChannel() {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: { noiseSuppression: true } })
			.then((stream) => {
				VoiceChannelConnection.createPeerConnection();

				this.addAudio(stream);

				console.log(VoiceChannelConnection.peerConnection);

				VoiceChannelConnection.peerConnection.getSenders().forEach((sender) => {
					const track = sender.track;

					if (track) {
						// Access the stream ID associated with the track
						const streamId = track.id;
						console.log(`Track ID: ${streamId}`);
					}
				});
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

		VoiceChannelConnection.sendSocketMessage("joinChannel", {
			channelId: VoiceChannelConnection.channelId,
			socketId: VoiceChannelConnection.socketId,
		});


		VoiceChannelConnection.peerConnection.ontrack = (event) => {
					console.log("Received remote track:", event.track);
					if (event.track.kind === "video") {
						const remoteVideo = document.createElement("video");
						remoteVideo.setAttribute("id", event.track.id);
						remoteVideo.setAttribute("class", "h-40 w-60");
						VoiceChannelConnection.joinAudio.currentTime = 0;
						VoiceChannelConnection.joinAudio.play();
						remoteVideo.srcObject = event.streams[0];
						remoteVideo.autoplay = true;
						VoiceChannelConnection.participantsList.appendChild(remoteVideo);
					} else if (event.track.kind === "audio") {
						const audioContext = new (window.AudioContext || window.webkitAudioContext)();
						const mediaStreamSource = audioContext.createMediaStreamSource(new MediaStream([event.track]));
						const audioDestination = audioContext.destination;
						mediaStreamSource.connect(audioDestination);

						audioContext
							.resume()
							.then(() => {
								console.log("Audio context started successfully");
							})
							.catch((error) => {
								console.error("Unable to start audio context:", error);
							});
					}
				};

		// Handle remote ICE candidates
		VoiceChannelConnection.peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				VoiceChannelConnection.sendSocketMessage("ice-candidate", {
					candidate: event.candidate,
					channelId: VoiceChannelConnection.channelId,
					socketId: VoiceChannelConnection.socketId,
				});
			}
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
		console.log(answer);
		VoiceChannelConnection.peerConnection
			.setRemoteDescription(rtcSessionDescription)
			.then(() => {
				console.log("Remote description set successfully");
			})
			.catch((error) => {
				console.error("Error setting remote description:", error);
				VoiceChannelConnection.peerConnection.close()
			});
	}

	muteSender(state) {
		console.log(VoiceChannelConnection.peerConnection);

		const audioSender = VoiceChannelConnection.peerConnection
			.getSenders()
			.find((sender) => sender.track.kind === "audio");
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
		VoiceChannelConnection.sendSocketMessage("disconnect", {
			socketId: VoiceChannelConnection.socketId,
			channelId: VoiceChannelConnection.channelId,
		});
		VoiceChannelConnection.socket.close();
		console.log(VoiceChannelConnection.peerConnection, "DC");
		VoiceChannelConnection.participantsList.innerHTML = "";

		VoiceChannelConnection.localVideo.remove();
	}
}
