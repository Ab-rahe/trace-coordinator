import { FastifyPluginCallback } from "fastify";
import { store } from "store";

export * from "./controller";
export * from "./experiments";
export * from "./experiment";

export const home: FastifyPluginCallback = (fastify, _opts_, done) => {
    fastify.get(`/`, async () => {
        return store.getState();
    });
    done();
};
