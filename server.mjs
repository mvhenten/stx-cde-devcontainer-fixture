import { createServer } from "node:http";

const port = 3000;

createServer((_request, response) => {
	response.writeHead(200, { "content-type": "text/plain" });
	response.end("fixture ok\n");
}).listen(port, () => {
	process.stdout.write(`fixture listening on ${port}\n`);
});
