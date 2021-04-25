import { FastifyPluginCallback } from "fastify";
import { trace_coordinator } from "core/TraceCoordinator";
import { maintainer_manager, store } from "store";
import { separated_datatree_maintainer, aggregated_datatree_maintainer } from "store/maintainers";

export const datatreeRoute: FastifyPluginCallback = (fastify, opts, done) => {
    maintainer_manager.register(separated_datatree_maintainer);
    maintainer_manager.register(aggregated_datatree_maintainer);
    fastify.get<{ Body: { requested_times: number[] }; Params: { exp_uuid: string; output_id: string } }>(
        `/experiments/:exp_uuid/outputs/datatree/:output_id/tree`,
        opts,
        async (request) => {
            maintainer_manager.dispatch(
                `DATATREE`,
                await trace_coordinator.fetchDataTree(
                    request.params.exp_uuid,
                    request.params.output_id,
                    request.body.requested_times,
                ),
            );
            maintainer_manager.dispatch(`AGGREGATE_DATATREE`);
            return store.getState().aggregated[request.params.exp_uuid].datatree![request.params.output_id];
        },
    );
    done();
};
