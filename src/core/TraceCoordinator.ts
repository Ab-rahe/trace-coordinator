import { TspClient } from "tsp-typescript-client";
import { TspClientFactory } from "./TspClientFactory";

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

    public async fetchExpriments() {
        for (const server of this._trace_servers.values()) {
            await server.fetchExperiments();
        }
    }
}

export const trace_coordinator = TraceCoordinator.getInstance();
