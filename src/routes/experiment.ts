import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_experiment } from "store/maintainers";
import { UpdateType } from "store/UpdateType";
import { fetchExperiment } from "./mock/fetch";

export const experiment: FastifyPluginCallback = (fastify, _opts_, done) => {
    maintainer_manager.register(separated_experiment);
    fastify.get(`/experiment/:UUID`, async (request: any) => {
        for (const [address, trace_server] of trace_coordinator.getServers()) {
            // const response = await trace_server.fetchExperiment(request.params.UUID);
            const response = fetchExperiment();
            if (response.isOk()) {
                maintainer_manager.dispatch(UpdateType.EXPERIMENT, { address, experiment: response.getModel() });
            }
        }
        maintainer_manager.dispatch(UpdateType.AGGREGATE_EXPERIMENTS);
        return store.getState().aggregated.experiments[request.params.UUID];
    });
    done();
};
