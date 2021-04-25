# trace-coordinator

clone the repo, `yarn` \
`yarn build` to compile then `yarn start` to run \
or `yarn dev` to run dev server \

## special endpoints

-   **/admin/fake**: inititate fake experiments in trace servers, provide that the servers are already running. Modify hardcoded paths in `core/TraceCoordinator.ts`
-   **/admin/save**: save entire state to `state.json`
