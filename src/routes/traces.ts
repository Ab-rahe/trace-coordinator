import { FastifyPluginCallback } from "fastify";

const traces: FastifyPluginCallback = (fastify, _opts, done) => {
    fastify.get(`/traces`, async () => {
        return `Traces`;
    });
    fastify.get(`/traces/:id`, async (request) => {
        return request.params;
    });
    done();
};

export default traces;
