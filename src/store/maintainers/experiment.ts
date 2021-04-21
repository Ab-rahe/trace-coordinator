/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Maintainer } from "store";
import { Experiment } from "tsp-typescript-client";

//TODO: handle data parsing errors

export const separated_experiment_maintainer: Maintainer = {
    EXPERIMENT: (state, data: { address: string; experiment: Experiment }) => {
        const new_state = { ...state };
        if (!new_state.separated[data.experiment.UUID]) new_state.separated.experiments[data.experiment.UUID] = {};
        if (!new_state.separated[data.experiment.UUID][data.address])
            new_state.separated[data.experiment.UUID][data.address] = {};
        new_state.separated[data.experiment.UUID][data.address].experiment = data.experiment;
        return new_state;
    },
};

export const aggregated_experiment_maintainer: Maintainer = {
    AGGREGATE_EXPERIMENT: (state, uuid: string) => {
        if (!state.separated[uuid]) return state;
        const new_state = { ...state };
        if (!new_state.aggregated[uuid]) new_state.aggregated[uuid] = {};
        new_state.aggregated[uuid].experiment = {
            UUID: uuid,
            name: ``,
            start: Number.MIN_VALUE,
            end: Number.MAX_VALUE,
            nbEvents: 0,
            indexingStatus: `COMPLETED`,
            traces: [],
        };
        for (const state_experiment of Object.values(new_state.separated[uuid])) {
            new_state.aggregated[uuid].experiment!.name = state_experiment.experiment!.name;
            if (state_experiment.experiment!.start < new_state.aggregated[uuid].experiment!.start)
                new_state.aggregated[uuid].experiment!.start = state_experiment.experiment!.start;
            if (state_experiment.experiment!.end > new_state.aggregated[uuid].experiment!.end)
                new_state.aggregated[uuid].experiment!.end = state_experiment.experiment!.end;
            new_state.aggregated[uuid].experiment!.nbEvents += state_experiment.experiment!.nbEvents;
            if (state_experiment.experiment!.indexingStatus === `RUNNING`)
                new_state.aggregated[uuid].experiment!.indexingStatus = `RUNNING`;
            new_state.aggregated[uuid].experiment!.traces.concat(state_experiment.experiment!.traces);
        }
        return new_state;
    },
};
