import { Maintainer } from "store";
import { Experiment } from "tsp-typescript-client";

//TODO: handle data parsing errors

export const separated_experiment_maintainer: Maintainer = {
    EXPERIMENT: (state, data: { exp_uuid: string; downloads: { address: string; experiment: Experiment }[] }) => {
        const new_state = { ...state };
        new_state.separated.experiments[data.exp_uuid] = {};
        for (const download of data.downloads) {
            new_state.separated[download.experiment.UUID][download.address] = {};
            new_state.separated[download.experiment.UUID][download.address].experiment = download.experiment;
        }
        return new_state;
    },
};

export const aggregated_experiment_maintainer: Maintainer = {
    AGGREGATE_EXPERIMENT: (state, exp_uuid: string) => {
        const new_state = { ...state };
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
        return new_state;
    },
};
