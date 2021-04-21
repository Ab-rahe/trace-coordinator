import { OutputDescriptor } from "tsp-typescript-client";
import { Maintainer } from "store";

//TODO: handle data parsing errors

export const separated_ouputs_maintainer: Maintainer = {
    OUTPUTS: (state, data: { exp_uuid: string; address: string; outputs: OutputDescriptor[] }) => {
        const new_state = { ...state };
        new_state.separated[data.exp_uuid][data.address].outputs = data.outputs;
        return new_state;
    },
};

export const aggregated_ouputs_maintainer: Maintainer = {
    AGGREGATE_OUTPUTS: (state, exp_uuid: string) => {
        if (!state.aggregated[exp_uuid]) return state;
        const new_state = { ...state };
        new_state.aggregated[exp_uuid].outputs = [
            ...new Set(
                Object.values(new_state.separated[exp_uuid])
                    .map((se) => se.outputs || [])
                    .flat(),
            ),
        ];
        return new_state;
    },
};
