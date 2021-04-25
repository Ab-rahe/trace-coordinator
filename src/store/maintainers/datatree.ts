import { Maintainer } from "store";
import { StateDataTree } from "configs/state.default";
import { ResponseStatus, OutputDescriptor } from "tsp-typescript-client";

// TODO: handle data parsing error

export const separated_datatree_maintainer: Maintainer = {
    DATATREE: (
        state,
        data: {
            exp_uuid: string;
            output_id: string;
            downloads: { address: string; datatree: StateDataTree }[];
        },
    ) => {
        const new_state = { ...state };
        for (const download of data.downloads) {
            new_state.separated[data.exp_uuid][download.address].datatree![data.output_id] = download.datatree;
        }
        return new_state;
    },
};

export const aggregated_datatree_maintainer: Maintainer = {
    AGGREGATE_DATATREE: (state, data: { exp_uuid: string; output_id: string }) => {
        const new_state = { ...state };
        new_state.aggregated[data.exp_uuid].datatree![data.output_id] = {
            model: {
                entries: [],
                headers: [],
            },
            status: ResponseStatus.COMPLETED,
            statusMessage: ``,
            output: {} as OutputDescriptor,
        };
        for (const { datatree } of Object.values(new_state.separated[data.exp_uuid])) {
            if (datatree![data.output_id].status === ResponseStatus.RUNNING)
                new_state.aggregated[data.exp_uuid].datatree![data.output_id].status = ResponseStatus.RUNNING;
            new_state.aggregated[data.exp_uuid].datatree![data.output_id].model.entries.concat(
                datatree![data.output_id].model.entries,
            );
            new_state.aggregated[data.exp_uuid].datatree![data.output_id].model.headers.concat(
                datatree![data.output_id].model.headers,
            );
        }
        return new_state;
    },
};
