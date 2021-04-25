import { Maintainer } from "store";
import { Experiment } from "tsp-typescript-client";
import { StateExperiment } from "configs/state.default";

//TODO: handle data parsing errors

export const separated_experiments_maintainer: Maintainer = {
    EXPERIMENTS: (state, data: { downloads: { address: string; experiments: Experiment[] }[] }) => {
        const new_state = { ...state };
        const x: { [exp_uuid: string]: { [address: string]: StateExperiment } } = {};
        for (const download of data.downloads) {
            for (const experiment of download.experiments) {
                if (!x[experiment.UUID]) x[experiment.UUID] = {};
                x[experiment.UUID][download.address] = {};
                x[experiment.UUID][download.address].experiment = experiment;
            }
        }
        new_state.separated = x;
        return new_state;
    },
};

export const aggregated_experiments_maintainer: Maintainer = {
    AGGREGATE_EXPERIMENTS: (state) => {
        const new_state = { ...state };
        new_state.aggregated = {};
        for (const exp_uuid in new_state.separated) {
            new_state.aggregated[exp_uuid] = {};
            new_state.aggregated[exp_uuid].experiment = {
                UUID: exp_uuid,
                name: ``,
                start: Number.MIN_VALUE,
                end: Number.MAX_VALUE,
                nbEvents: 0,
                indexingStatus: `COMPLETED`,
                traces: [],
            };
            for (const { experiment } of Object.values(new_state.separated[exp_uuid])) {
                new_state.aggregated[exp_uuid].experiment!.name = experiment!.name;
                if (new_state.aggregated[exp_uuid].experiment!.start > experiment!.start)
                    new_state.aggregated[exp_uuid].experiment!.start = experiment!.start;
                if (new_state.aggregated[exp_uuid].experiment!.end < experiment!.end)
                    new_state.aggregated[exp_uuid].experiment!.end = experiment!.end;
                new_state.aggregated[exp_uuid].experiment!.nbEvents += experiment!.nbEvents;
                if (experiment!.indexingStatus === `RUNNING`)
                    new_state.aggregated[exp_uuid].experiment!.indexingStatus = `RUNNING`;
                new_state.aggregated[exp_uuid].experiment!.traces.concat(experiment!.traces);
            }
        }
        return new_state;
    },
};
