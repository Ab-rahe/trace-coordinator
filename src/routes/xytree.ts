import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_xytree_maintainer, aggregated_xytree_maintainer } from "store/maintainers";

export const xytreeRoute: FastifyPluginCallback = (fastify, opts, done) => {
    maintainer_manager.register(separated_xytree_maintainer);
    maintainer_manager.register(aggregated_xytree_maintainer);
    fastify.get<{ Body: { requested_times: number[] }; Params: { exp_uuid: string; output_id: string } }>(
        `/experiments/:exp_uuid/outputs/xytree/:output_id/tree`,
        opts,
        async (request) => {
            maintainer_manager.dispatch(
                `XYTREE`,
                await trace_coordinator.fetchTimegraphTree(
                request.params.exp_uuid,
                request.params.output_id,
                request.body.requested_times,
                ),
            );
            maintainer_manager.dispatch(`AGGREGATE_XYTREE`);
            return store.getState().aggregated[request.params.exp_uuid].xytree![request.params.output_id];
        },
    );
    done();
};