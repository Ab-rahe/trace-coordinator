process.on(`unhandledRejection`, (reason, promise) => {
    console.error(`Unhandled Rejection at:`, promise, `reason:`, reason);
    process.exit(1);
});

import Fastify, { FastifyInstance } from "fastify";
import tracesRoute from "./routes/traces";

const server: FastifyInstance = Fastify({});
server.register(tracesRoute);

const start = async () => {
    try {
        await server.listen(3000, `0.0.0.0`);

        const address = server.server.address();
        const port = typeof address === `string` ? address : address?.port;
        console.log(`server listen on ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
