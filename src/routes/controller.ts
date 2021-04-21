import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";

export const controllerRoute: FastifyPluginCallback = (fastify, _opts_, done) => {
    fastify.post(`/controller/tracing`, async () => {
        trace_coordinator.initTraceServer();
        return;
    });
    done();
};
