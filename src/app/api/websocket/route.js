import { WebSocketServer } from "ws";

let wss;

export async function GET(request, response) {
	if (request.method === "GET" && request.headers.upgrade === "websocket") {
		const headers = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "content-Type",
		};
		response.writeHead(101, headers);
		response.socket.wss = wss;
		wss.handleUpgrade(request, response.socket, Buffer.alloc(0), (ws) => {
			wss.emit("connection", ws, request);
		});
		return;
	}

	if (!wss) {
		wss = new WebSocketServer({ noServer: true });

		wss.on("connection", (ws) => {
			console.log("User connected");

			ws.on("message", (message) => {
				const data = JSON.parse(message);
				console.log("Received:", data);

				if (data.type === "like_or_save") {
					wss.clients.forEach((client) => {
						if (client.readyState === client.OPEN) {
							client.send(
								JSON.stringify({
									type: "update_interaction_counts",
									postId: data.postId,
									like_count: data.like_count,
									save_count: data.save_count,
								})
							);
						}
					});
				}
			});

			ws.on("close", () => {
				console.log("User disconnected");
			});
		});

		return new Response("WebSocket server is running");
	}
}
