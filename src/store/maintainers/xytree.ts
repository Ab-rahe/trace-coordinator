import { Maintainer } from "store";
import { StateXyTree } from "configs/state.default";
import { ResponseStatus, OutputDescriptor } from "tsp-typescript-client";

export const separated_xytree_maintainer: Maintainer = {
    XYTREE: (
        state,
        data: { 
            exp_uuid: string; 
            output_id: string; 
            downloads:{ address: string; xytree: StateXyTree }[];
        },
        ) => {
        const new_state = { ...state };
        for (const download of data.downloads) {
        new_state.separated[data.exp_uuid][download.address].xytree![data.output_id] = download.xytree;
        }
        return new_state;
    },
};


export const aggregated_xytree_maintainer: Maintainer = {
    AGGREGATE_XYTREE: (state, data: { exp_uuid: string; output_id: string }) => {
        const new_state = { ...state };
        new_state.aggregated[data.exp_uuid].xytree![data.output_id] = {
            model: {
                entries: [],
                headers: [],
            },
            status: ResponseStatus.COMPLETED,
            statusMessage: ``,
            output: {} as OutputDescriptor,
        };
        for (const state_experiment of Object.values(new_state.separated[data.exp_uuid])) {
            if (state_experiment.xytree![data.output_id].status === ResponseStatus.RUNNING)
                new_state.aggregated[data.exp_uuid].xytree![data.output_id].status = ResponseStatus.RUNNING;
            new_state.aggregated[data.exp_uuid].xytree![data.output_id].model.entries.concat(
                state_experiment.xytree![data.output_id].model.entries,
            );
            new_state.aggregated[data.exp_uuid].xytree![data.output_id].model.headers.concat(
                state_experiment.xytree![data.output_id].model.headers,
            );
        }
        return new_state;
    },
};
