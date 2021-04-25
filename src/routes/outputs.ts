import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_ouputs_maintainer, aggregated_ouputs_maintainer } from "store/maintainers";

export const outputsRoute: FastifyPluginCallback = (fastify, opts, done) => {
    maintainer_manager.register(separated_ouputs_maintainer);
    maintainer_manager.register(aggregated_ouputs_maintainer);
    fastify.get<{ Params: { expUUID: string } }>(`/experiments/:expUUID/outputs`, opts, async (request) => {
        maintainer_manager.dispatch(`OUTPUTS`, await trace_coordinator.fetchOutputs(request.params.expUUID));
        maintainer_manager.dispatch(`AGGREGATE_OUTPUTS`);
        return store.getState().aggregated[request.params.expUUID].outputs;
    });
    done();
};
