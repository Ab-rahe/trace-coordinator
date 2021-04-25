process.on(`unhandledRejection`, (reason, promise) => {
    console.error(`Unhandled Rejection at:`, promise, `reason:`, reason);
    process.exit(1);
});

import Fastify, { FastifyInstance } from "fastify";
import traservers_config from "configs/traceservers.config";
import { trace_coordinator } from "core/TraceCoordinator";
import { experimentsRoute, experimentRoute, outputsRoute, timegraphRoute } from "routes";
import "lib/OverloadedObject";

const server: FastifyInstance = Fastify({});

// TODO: Debug purpose only
import fs from "fs";
import { store } from "store";
server.post(`/admin/save`, async () => {
    fs.writeFile(`state.json`, JSON.stringify({ state: store.getState(), history: store.getHistory() }), (err) => {
        if (err) {
            throw err;
        }
    });
    return `State saved successfully`;
});
server.post(`/admin/fake`, async () => {
    await trace_coordinator.createFakeTestCaseTraceServer();
    return `done`;
});
//////////////////////////////////////////////////

const opts = { prefix: `/tsp/api` };
server.register(experimentsRoute, opts);
server.register(experimentRoute, opts);
server.register(outputsRoute, opts);
server.register(timegraphRoute, opts);

// start server
(async () => {
    try {
        traservers_config.forEach((traceserver_address) => {
            trace_coordinator.addServer(traceserver_address);
        });
        await server.listen(3000, `0.0.0.0`);
        const address = server.server.address();
        const port = typeof address === `string` ? address : address?.port;
        console.log(`server listen on ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
