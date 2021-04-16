import { TspClientResponse, Experiment } from "tsp-typescript-client";

export function fetchExperiments(): TspClientResponse<Experiment[]> {
    return new TspClientResponse<Experiment[]>(
        [
            {
                UUID: `1234`,
                name: `example`,
                start: Math.random(),
                end: Math.random(),
                nbEvents: Math.random(),
                indexingStatus: `RUNNING`,
                traces: [],
            },
            {
                UUID: `2345`,
                name: `example`,
                start: Math.random(),
                end: Math.random(),
                nbEvents: Math.random(),
                indexingStatus: `COMPLETED`,
                traces: [],
            },
        ],
        200,
        `SUCCES`,
    );
}

export function fetchExperiment(): TspClientResponse<Experiment> {
    return new TspClientResponse<Experiment>(
        {
            UUID: `1234`,
            name: `example`,
            start: Math.random(),
            end: Math.random(),
            nbEvents: Math.random(),
            indexingStatus: `COMPLETED`,
            traces: [],
        },
        200,
        `SUCCES`,
    );
}
