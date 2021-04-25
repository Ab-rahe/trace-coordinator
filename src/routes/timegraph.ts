import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_timegraph_maintainer, aggregated_timegraph_maintainer } from "store/maintainers";

export const timegraphRoute: FastifyPluginCallback = (fastify, opts, done) => {
    maintainer_manager.register(separated_timegraph_maintainer);
    maintainer_manager.register(aggregated_timegraph_maintainer);
    fastify.get<{ Body: { requested_times: number[] }; Params: { exp_uuid: string; output_id: string } }>(
        `/experiments/:exp_uuid/outputs/timeGraph/:output_id/tree`,
        opts,
        async (request) => {
            maintainer_manager.dispatch(
                `TIMEGRAPH`,
                await trace_coordinator.fetchTimegraphTree(
                    request.params.exp_uuid,
                    request.params.output_id,
                    request.body.requested_times,
                ),
            );
            maintainer_manager.dispatch(`AGGREGATE_TIMEGRAPH`);
            return store.getState().aggregated[request.params.exp_uuid].timegraph![request.params.output_id];
        },
    );
    done();
};
