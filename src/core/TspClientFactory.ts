import { TspClient } from "tsp-typescript-client";

export class TspClientFactory {
    public static createTspClient(address: string): TspClient {
        return new TspClient(address);
    }
}
