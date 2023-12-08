import express from "express";
import cors from "cors";
import * as path from "path";
import serversApi from "./serversAPI/index.js";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { db } from "../config/db.js";
import { createWorker } from "./worker.js";
import { randomUUID } from "crypto";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { createWebRtcTransport } from "./createWebRtcTransport.js";
dotenv.config();
//import UserAuth from "./UserAuth/index.mjs";
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
global.__dirname = __dirname;
const app = express();
const port = process.env.PORT || 3300;
const server = http.createServer(app);

///////////////////////////////////////////////////////////
// Middleware /////////////////////////////////////////////
///////////////////////////////////////////////////////////

app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public/", express.static(path.join(__dirname, "../public/")));
app.use("/api/servers/", serversApi);
//app.use("/auth", UserAuth);

///////////////////////////////////////////////////////////
// Routes /////////////////////////////////////////////////
///////////////////////////////////////////////////////////

app.post("/receiveMessage", (req, res) => {
	const { message, user, channel } = req.body;

	const insertQuery =
		"INSERT INTO serverMessages (message, uuid, user, channel, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
	db.run(insertQuery, [message, randomUUID(), user, channel], function (err) {
		if (err) {
			res.status(500).json({ err: err.message });
			return;
		}
		console.log("Successfully inserted");
	});
});

app.get("/getMessage", (req, res) => {});

///////////////////////////////////////////////////////////
// Socket /////////////////////////////////////////////////
///////////////////////////////////////////////////////////

const io = new SocketIOServer(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

let mediasoupRouter;
let producerTransport;
let producer;

try {
	mediasoupRouter = await createWorker();
} catch (err) {
	throw err;
}

io.on("connection", (socket) => {
	console.log("User connected");

	socket.on("message", async (msg) => {
		switch (msg.type) {
			case "getRouterRtpCapabilities":
				onRouterRtpCapabilities(msg, socket);
				break;
			case "createProducerTransport":
				onCreateProducerTransport(msg, socket);
				break;
			case "connectProducerTransport":
				onConnectProducerTransport(msg, socket);
				break;
			case "produce":
				console.log("PRODUCE GOT CALLED");
				onProduce(msg, socket);
				break;
			default:
				break;
		}
		onRouterRtpCapabilities(msg, socket);
	});
});

const onRouterRtpCapabilities = (msg, socket) => {
	socket.emit("message", { type: "routerCapabilities", data: mediasoupRouter.rtpCapabilities });
};

const onCreateProducerTransport = async (msg, socket) => {
	try {
		const { transport, params } = await createWebRtcTransport(mediasoupRouter);
		producerTransport = transport;
		socket.emit("message", { type: "producerTransportCreated", data: params });
	} catch (err) {
		console.error(err);
		socket.emit("message", { type: "producerTransportCreated", error: err });
	}
};

const onConnectProducerTransport = async (msg, socket) => {
	const { dtlsParameters } = msg;
	await producerTransport.connect({ dtlsParameters });
	socket.emit("message", { type: "producerConnected" });
};

const onProduce = async (msg, socket) => {
	const { kind, rtpParameters } = msg;
	console.log(kind, rtpParameters);
	producer = await producerTransport.produce({ kind, rtpParameters });
	const message = {
		id: producer.id,
	};

	socket.emit("published", message);
	broadcast(socket, "newProducer", "new user");
};

const broadcast = (socket, type, msg) => {
	const message = {
		type,
		data: msg,
	};
	socket.broadcast.emit("message", message);
};

///////////////////////////////////////////////////////////
// Run server and error handling //////////////////////////
///////////////////////////////////////////////////////////

server.listen(port, () => {
	console.log(`server listening at Port: ${port}`);
});
