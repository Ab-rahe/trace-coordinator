/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Maintainer } from "store";
import { Experiment } from "tsp-typescript-client";

//TODO: handle data parsing errors

export const separated_experiments_maintainer: Maintainer = {
    EXPERIMENTS: (state, data: { address: string; experiments: Experiment[] }) => {
        const new_state = { ...state };
        for (const experiment of data.experiments) {
            if (!new_state.separated[experiment.UUID]) new_state.separated.experiments[experiment.UUID] = {};
            if (!new_state.separated[experiment.UUID][data.address])
                new_state.separated[experiment.UUID][data.address] = {};
            new_state.separated[experiment.UUID][data.address].experiment = experiment;
        }
        return new_state;
    },
};

export const aggregated_experiments_maintainer: Maintainer = {
    AGGREGATE_EXPERIMENTS: (state) => {
        const new_state = { ...state };
        new_state.aggregated.experiments = {};
        for (const uuid in new_state.separated) {
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
            for (const separated_state_experiment of Object.values(new_state.separated[uuid])) {
                new_state.aggregated[uuid].experiment!.name = separated_state_experiment.experiment!.name;
                if (separated_state_experiment.experiment!.start < new_state.aggregated[uuid].experiment!.start)
                    new_state.aggregated[uuid].experiment!.start = separated_state_experiment.experiment!.start;
                if (separated_state_experiment.experiment!.end > new_state.aggregated[uuid].experiment!.end)
                    new_state.aggregated[uuid].experiment!.end = separated_state_experiment.experiment!.end;
                new_state.aggregated[uuid].experiment!.nbEvents += separated_state_experiment.experiment!.nbEvents;
                if (separated_state_experiment.experiment!.indexingStatus === `RUNNING`)
                    new_state.aggregated[uuid].experiment!.indexingStatus = `RUNNING`;
                new_state.aggregated[uuid].experiment!.traces.concat(separated_state_experiment.experiment!.traces);
            }
        }
        return new_state;
    },
};
