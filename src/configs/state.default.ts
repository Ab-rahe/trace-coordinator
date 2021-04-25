import { Experiment, OutputDescriptor, GenericResponse, EntryModel, EntryHeader, Entry } from "tsp-typescript-client";

// TODO: Fill issue TS, mapped types allow empty object, but not keyed type
export type StateTimegraph = GenericResponse<EntryModel<Entry, EntryHeader>>;
export type StateExperiment = {
    experiment?: Experiment;
    outputs?: OutputDescriptor[];
    timegraph?: {
        [id: string]: StateTimegraph;
    };
};
type State = {
    readonly aggregated: {
        [uuid: string]: StateExperiment;
    };
    readonly separated: {
        [uuid: string]: {
            [addresss: string]: StateExperiment;
        };
    };
};

const state: State = {
    aggregated: {},
    separated: {},
};

export default state;
