import { Experiment } from "tsp-typescript-client";
import { Maintainer } from "store";

export const separated_experiments: Maintainer = {
    EXPERIMENTS: (state, data: { address: string; experiments: Experiment[] }) => {
        const new_state = { ...state };
        for (const experiment of data.experiments) {
            if (!new_state.separated.experiments[experiment.UUID])
                new_state.separated.experiments[experiment.UUID] = {};
            new_state.separated.experiments[experiment.UUID][data.address] = experiment;
        }
        return new_state;
    },
};

export const separated_experiment: Maintainer = {
    EXPERIMENT: (state, data: { address: string; experiment: Experiment }) => {
        const new_state = { ...state };
        if (!new_state.separated.experiments[data.experiment.UUID])
            new_state.separated.experiments[data.experiment.UUID] = {};
        new_state.separated.experiments[data.experiment.UUID][data.address] = data.experiment;
        return new_state;
    },
};

export const aggregated_experiments: Maintainer = {
    AGGREGATE_EXPERIMENTS: (state) => {
        const new_state = { ...state };
        new_state.aggregated.experiments = {};
        for (const uuid in new_state.separated.experiments) {
            new_state.aggregated.experiments[uuid] = {
                UUID: uuid,
                name: ``,
                start: Number.MIN_VALUE,
                end: Number.MAX_VALUE,
                nbEvents: 0,
                indexingStatus: `COMPLETED`,
                traces: [],
            };
            for (const experiment of Object.values(new_state.separated.experiments[uuid])) {
                new_state.aggregated.experiments[uuid].name = experiment.name;
                if (experiment.start < new_state.aggregated.experiments[uuid].start)
                    new_state.aggregated.experiments[uuid].start = experiment.start;
                if (experiment.end > new_state.aggregated.experiments[uuid].end)
                    new_state.aggregated.experiments[uuid].end = experiment.end;
                new_state.aggregated.experiments[uuid].nbEvents += experiment.nbEvents;
                if (experiment.indexingStatus === `RUNNING`)
                    new_state.aggregated.experiments[uuid].indexingStatus = `RUNNING`;
                new_state.aggregated.experiments[uuid].traces.concat(experiment.traces);
            }
        }
        return new_state;
    },
};
