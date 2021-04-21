process.on(`unhandledRejection`, (reason, promise) => {
    console.error(`Unhandled Rejection at:`, promise, `reason:`, reason);
    process.exit(1);
});

import Fastify, { FastifyInstance } from "fastify";
import traservers_config from "configs/traceservers.config";
import { trace_coordinator } from "core/TraceCoordinator";
import { controllerRoute, experimentsRoute, experimentRoute, outputsRoute } from "routes";
import "lib/OverloadedObject";

const server: FastifyInstance = Fastify({});

// For debug purpose, save all state to state.json
import fs from "fs";
import { store } from "store";
server.get(`/debug`, async () => {
    fs.writeFile(`state.json`, JSON.stringify({ state: store.getState(), history: store.getHistory() }), (err) => {
        if (err) {
            throw err;
        }
        console.log(`State are saved.`);
    });
});
//////////////////////////////////////////////////

server.register(controllerRoute);
server.register(experimentsRoute);
server.register(experimentRoute);
server.register(outputsRoute);

(async () => {
    try {
        await server.listen(3000, `0.0.0.0`);
        const address = server.server.address();
        const port = typeof address === `string` ? address : address?.port;
        init();
        console.log(`server listen on ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();

function init() {
    Object.keys(traservers_config).forEach((traceserver_address) => {
        trace_coordinator.addServer(traceserver_address);
    });
}
