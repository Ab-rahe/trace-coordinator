import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_experiments } from "store/maintainers";
import { fetchExperiments } from "./mock/fetch";

export const experiments: FastifyPluginCallback = (fastify, _opts_, done) => {
    maintainer_manager.register(separated_experiments);
    fastify.get(`/experiments`, async () => {
        for (const [address, trace_server] of trace_coordinator.getServers()) {
            // const response = await trace_server.fetchExperiments();
            const response = fetchExperiments();
            if (response.isOk()) {
                maintainer_manager.dispatch(`EXPERIMENTS`, { address, experiments: response.getModel() });
            }
        }
        maintainer_manager.dispatch(`AGGREGATE_EXPERIMENTS`);
        return store.getState().aggregated.experiments;
    });
    done();
};
