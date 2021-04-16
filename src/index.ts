process.on(`unhandledRejection`, (reason, promise) => {
    console.error(`Unhandled Rejection at:`, promise, `reason:`, reason);
    process.exit(1);
});

import Fastify, { FastifyInstance } from "fastify";
import traservers_config from "configs/traceservers.config";
import { trace_coordinator } from "core/TraceCoordinator";
import {
    controller as controllerRoute,
    experiments as experimentsRoute,
    experiment as experimentRoute,
    home,
} from "routes";
import { maintainer_manager } from "store";
import { aggregated_experiments } from "store/maintainers";
import "lib/OverloadedObject";

const server: FastifyInstance = Fastify({});
server.register(home);
server.register(controllerRoute);
server.register(experimentsRoute);
server.register(experimentRoute);
maintainer_manager.register(aggregated_experiments);

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
