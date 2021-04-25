import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_experiments_maintainer, aggregated_experiments_maintainer } from "store/maintainers";

export const experimentsRoute: FastifyPluginCallback = (fastify, opts, done) => {
    maintainer_manager.register(separated_experiments_maintainer);
    maintainer_manager.register(aggregated_experiments_maintainer);
    fastify.get(`/experiments`, opts, async () => {
        maintainer_manager.dispatch(`EXPERIMENTS`, await trace_coordinator.fetchExperiments());
        maintainer_manager.dispatch(`AGGREGATE_EXPERIMENTS`);
        return Object.values(store.getState().aggregated);
    });
    done();
};
