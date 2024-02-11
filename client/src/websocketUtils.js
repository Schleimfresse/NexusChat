const ws = new WebSocket("wss://localhost:3300/wss");

export const WebsocketService = {


	connect: (userId) => {
		ws.addEventListener("open", () => {
			ws.send(JSON.stringify({ type: "alive", data: { userId } }));
		});
	},

	sendMessage: (type, data) => {
		ws.send(JSON.stringify({ type, data }));
	},

	receiveMessage: (callback) => {
		ws.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);
			callback(data)
			/*switch (message.type) {
				case "connection-success":
					// Handle connection success
					break;
				case "user-status":
					// Handle user status
					break;
				default:
					break;
			}*/
		});
	  },
}

ws.addEventListener("close", (event) => {
	if (!navigator.onLine) { 
		console.log("OFFLINE DUE TO NETWORK ISSUES");
	}
})