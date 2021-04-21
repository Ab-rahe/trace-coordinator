import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_experiment_maintainer, aggregated_experiment_maintainer } from "store/maintainers";

export const experimentRoute: FastifyPluginCallback = (fastify, _opts_, done) => {
    maintainer_manager.register(separated_experiment_maintainer);
    maintainer_manager.register(aggregated_experiment_maintainer);
    fastify.get<{ Params: { UUID: string } }>(`/experiment/:UUID`, async (request) => {
        for (const data of await trace_coordinator.fetchExperiment(request.params.UUID)) {
            maintainer_manager.dispatch(`EXPERIMENT`, data);
        }
        maintainer_manager.dispatch(`AGGREGATE_EXPERIMENT`, request.params.UUID);
        return { ...store.getState().aggregated[request.params.UUID] };
    });
    done();
};
