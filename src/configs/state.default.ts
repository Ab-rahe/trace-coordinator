import { Experiment } from "tsp-typescript-client";

type State = {
    readonly aggregated: {
        experiments: {
            [uuid: string]: Experiment;
        };
    };
    readonly separated: {
        readonly experiments: {
            [uuid: string]: {
                [addresss: string]: Experiment;
            };
        };
    };
};

const state: State = {
    aggregated: {
        experiments: {},
    },
    separated: {
        experiments: {},
    },
};

export default state;
