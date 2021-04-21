import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_ouputs_maintainer, aggregated_ouputs_maintainer } from "store/maintainers";

export const outputsRoute: FastifyPluginCallback = (fastify, _opts_, done) => {
    maintainer_manager.register(separated_ouputs_maintainer);
    maintainer_manager.register(aggregated_ouputs_maintainer);
    fastify.get<{ Params: { expUUID: string } }>(`/experiments/:expUUID/outputs`, async (request) => {
        for (const data of await trace_coordinator.fetchOutputs(request.params.expUUID)) {
            maintainer_manager.dispatch(`OUTPUTS`, data);
        }
        maintainer_manager.dispatch(`AGGREGATE_OUTPUTS`);
        return store.getState().aggregated[request.params.expUUID].outputs;
    });
    done();
};
