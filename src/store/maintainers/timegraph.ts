/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Maintainer } from "store";
import { StateTimegraph } from "configs/state.default";
import { ResponseStatus, OutputDescriptor } from "tsp-typescript-client";

// TODO: handle data parsing error

export const separated_timegraph_maintainer: Maintainer = {
    TIMEGRAPH: (state, data: { exp_uuid: string; address: string; output_id: string; timegraph: StateTimegraph }) => {
        const new_state = { ...state };
        new_state.separated[data.exp_uuid][data.address].timegraph![data.output_id] = data.timegraph;
        return new_state;
    },
};

export const aggregated_timegraph_maintainer: Maintainer = {
    AGGREGATE_TIMEGRAPH: (state, data: { exp_uuid: string; output_id: string }) => {
        if (!state.aggregated[data.exp_uuid]) return state;
        const new_state = { ...state };
        new_state.aggregated[data.exp_uuid].timegraph![data.output_id] = {
            model: {
                entries: [],
                headers: [],
            },
            status: ResponseStatus.COMPLETED,
            statusMessage: ``,
            output: {} as OutputDescriptor,
        };
        for (const state_experiment of Object.values(new_state.separated[data.exp_uuid])) {
            if (state_experiment.timegraph![data.output_id].status === ResponseStatus.RUNNING)
                new_state.aggregated[data.exp_uuid].timegraph![data.output_id].status = ResponseStatus.RUNNING;
            new_state.aggregated[data.exp_uuid].timegraph![data.output_id].model.entries.concat(
                state_experiment.timegraph![data.output_id].model.entries,
            );
            new_state.aggregated[data.exp_uuid].timegraph![data.output_id].model.headers.concat(
                state_experiment.timegraph![data.output_id].model.headers,
            );
        }
        return new_state;
    },
};
