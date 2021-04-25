import { Maintainer } from "store";
import { StateTimegraph } from "configs/state.default";
import { ResponseStatus, OutputDescriptor } from "tsp-typescript-client";

// TODO: handle data parsing error

export const separated_timegraph_maintainer: Maintainer = {
    TIMEGRAPH: (
        state,
        data: {
            exp_uuid: string;
            output_id: string;
            downloads: { address: string; timegraph: StateTimegraph }[];
        },
    ) => {
        const new_state = { ...state };
        for (const download of data.downloads) {
            new_state.separated[data.exp_uuid][download.address].timegraph![data.output_id] = download.timegraph;
        }
        return new_state;
    },
};

export const aggregated_timegraph_maintainer: Maintainer = {
    AGGREGATE_TIMEGRAPH: (state, data: { exp_uuid: string; output_id: string }) => {
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
        for (const { timegraph } of Object.values(new_state.separated[data.exp_uuid])) {
            if (timegraph![data.output_id].status === ResponseStatus.RUNNING)
                new_state.aggregated[data.exp_uuid].timegraph![data.output_id].status = ResponseStatus.RUNNING;
            new_state.aggregated[data.exp_uuid].timegraph![data.output_id].model.entries.concat(
                timegraph![data.output_id].model.entries,
            );
            new_state.aggregated[data.exp_uuid].timegraph![data.output_id].model.headers.concat(
                timegraph![data.output_id].model.headers,
            );
        }
        return new_state;
    },
};
