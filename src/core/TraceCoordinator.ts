import { OutputDescriptor, TspClient, Experiment, QueryHelper, Query } from "tsp-typescript-client";
import { TspClientFactory } from "./TspClientFactory";
import { RestError } from "lib/RestError";
import { StateTimegraph } from "configs/state.default";

import rimraf from "rimraf";
import os from "os";

class TraceCoordinator {
    private readonly _trace_servers: { [adddress: string]: TspClient };
    private static readonly _instance = new TraceCoordinator();

    private constructor() {
        this._trace_servers = {};
    }

    public static getInstance() {
        return this._instance;
    }

    public getServer(address: string) {
        return this._trace_servers[address];
    }

    public getServers() {
        return this._trace_servers;
    }

    public addServer(address: string) {
        this._trace_servers[address] = TspClientFactory.createTspClient(address);
    }

    // TODO: Debug purpose only
    public async createFakeTestCaseTraceServer() {
        rimraf(`${os.homedir()}/.tracecompass*`, (e) => console.error(e));
        const traces_path = [
            `/home/ubuntu/baby/Dropbox/dev/theia-tracecompass/TraceCompassTutorialTraces/103-compare-package-managers/apt`,
            `/home/ubuntu/baby/Dropbox/dev/theia-tracecompass/TraceCompassTutorialTraces/103-compare-package-managers/pacman`,
            `/home/ubuntu/baby/Dropbox/dev/theia-tracecompass/TraceCompassTutorialTraces/103-compare-package-managers/yum`,
            `/home/ubuntu/baby/Dropbox/dev/theia-tracecompass/TraceCompassTutorialTraces/103-compare-package-managers/zypper`,
        ];
        let i = 0,
            j = 0;
        const exp_uuid = `this-is-a-unique-id`;
        for (const server of Object.values(this._trace_servers)) {
            if (i >= traces_path.length - 1) i = 0;
            const response = await server.openTrace(new Query({ uri: traces_path[i], name: traces_path[i] }));
            server.createExperiment(
                new Query({ name: `experiment ${j}`, traces: [`${response.getModel().UUID}`], uuid: exp_uuid }),
            );
            i++;
            j++;
        }
    }
    //////////////////////////////////////////

    public async fetchExperiment(uuid: string) {
        const result = {
            exp_uuid: uuid,
            downloads: [] as { address: string; experiment: Experiment }[],
        };
        for (const [address, trace_server] of Object.entries(this.getServers())) {
            const experiments_response = await trace_server.fetchExperiment(uuid);
            if (!experiments_response.isOk())
                throw new RestError(experiments_response.getStatusCode(), experiments_response.getStatusMessage());
            const experiment = experiments_response.getModel() as Experiment;
            result.downloads.push({ address, experiment });
        }
        return result;
    }

    public async fetchExperiments() {
        const result = {
            downloads: [] as { address: string; experiments: Experiment[] }[],
        };
        for (const [address, trace_server] of Object.entries(this.getServers())) {
            const experiments_response = await trace_server.fetchExperiments();
            if (!experiments_response.isOk())
                throw new RestError(experiments_response.getStatusCode(), experiments_response.getStatusMessage());
            const experiments = experiments_response.getModel() as Experiment[];
            result.downloads.push({ address, experiments });
        }
        return result;
    }

    public async fetchOutputs(uuid: string) {
        const result = {
            exp_uuid: uuid,
            downloads: [] as { address: string; outputs: OutputDescriptor[] }[],
        };
        for (const [address, trace_server] of Object.entries(this.getServers())) {
            const outputs_reponse = await trace_server.experimentOutputs(uuid);
            if (!outputs_reponse.isOk())
                throw new RestError(outputs_reponse.getStatusCode(), outputs_reponse.getStatusMessage());
            result.downloads.push({ address, outputs: outputs_reponse.getModel() });
        }
        return result;
    }

    public async fetchTimegraphTree(exp_uuid: string, output_id: string, requested_times: number[]) {
        const result = {
            exp_uuid,
            output_id,
            downloads: [] as { address: string; timegraph: StateTimegraph }[],
        };
        for (const [address, trace_server] of Object.entries(this.getServers())) {
            const timegraph_reponse = await trace_server.fetchTimeGraphTree(
                exp_uuid,
                output_id,
                QueryHelper.timeQuery(requested_times),
            );
            if (!timegraph_reponse.isOk())
                throw new RestError(timegraph_reponse.getStatusCode(), timegraph_reponse.getStatusMessage());
            result.downloads.push({ address, timegraph: timegraph_reponse.getModel() });
        }
        return result;
    }
}

export const trace_coordinator = TraceCoordinator.getInstance();
