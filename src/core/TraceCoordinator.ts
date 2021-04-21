import { TspClient } from "tsp-typescript-client";
import { TspClientFactory } from "./TspClientFactory";
import { Experiment, QueryHelper } from "tsp-typescript-client";
import { RestError } from "lib/RestError";

class TraceCoordinator {
    private readonly _trace_servers;
    private static readonly _instance = new TraceCoordinator();

    private constructor() {
        this._trace_servers = new Map<string, TspClient>();
    }

    public static getInstance() {
        return this._instance;
    }

    public getServer(address: string) {
        return this._trace_servers.get(address);
    }

    public getServers() {
        return this._trace_servers;
    }

    public addServer(address: string) {
        this._trace_servers.set(address, TspClientFactory.createTspClient(address));
    }

    public initTraceServer() {
        for (const server of this._trace_servers.values()) {
            server.toString();
        }
    }

    public async fetchExperiments() {
        const result = [];
        for (const [address, trace_server] of this.getServers()) {
            const experiments_response = await trace_server.fetchExperiments();
            // const experiments_response = fetchExperiments();
            if (experiments_response.isOk())
                throw new RestError(experiments_response.getStatusCode(), experiments_response.getStatusMessage());
            const experiments = experiments_response.getModel() as Experiment[];
            result.push({ address, experiments });
        }
        return result;
    }

    public async fetchExperiment(uuid: string) {
        const result = [];
        for (const [address, trace_server] of this.getServers()) {
            const experiments_response = await trace_server.fetchExperiment(uuid);
            // const experiments_response = fetchExperiments();
            if (!experiments_response.isOk())
                throw new RestError(experiments_response.getStatusCode(), experiments_response.getStatusMessage());
            const experiment = experiments_response.getModel() as Experiment;
            result.push({ address, experiment });
        }
        return result;
    }

    public async fetchOutputs(uuid: string) {
        const result = [];
        for (const [address, trace_server] of this.getServers()) {
            const outputs_reponse = await trace_server.experimentOutputs(uuid);
            if (outputs_reponse.isOk())
                throw new RestError(outputs_reponse.getStatusCode(), outputs_reponse.getStatusMessage());
            result.push({ exp_uuid: uuid, address, outputs: outputs_reponse.getModel() });
        }
        return result;
    }

    public async fetchTimegraphTree(exp_uuid: string, output_id: string, requested_times: number[]) {
        const result = [];
        for (const [address, trace_server] of this.getServers()) {
            const timegraph_reponse = await trace_server.fetchTimeGraphTree(
                exp_uuid,
                output_id,
                QueryHelper.timeQuery(requested_times),
            );
            if (timegraph_reponse.isOk())
                throw new RestError(timegraph_reponse.getStatusCode(), timegraph_reponse.getStatusMessage());
            result.push({ exp_uuid, address, output_id, outputs: timegraph_reponse.getModel() });
        }
        return result;
    }
}

export const trace_coordinator = TraceCoordinator.getInstance();
