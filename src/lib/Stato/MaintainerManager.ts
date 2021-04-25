import { Store } from "./Store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MaintainerCallback<T, V> = (state: T, data?: any, type?: V) => T;
export type Maintainer<T, V extends string | number> = {
    preware?: MaintainerCallback<T, V>;
} & {
    [t in V]?: MaintainerCallback<T, V>;
};

// TODO: submit issue on typescript for this usecase the compiler unable to know the type if T passed in is generic
// type RequireOne<T, K extends keyof T> = {
//     [X in Exclude<keyof T, K>]?: T[X];
// } &
//     {
//         [P in K]-?: T[P];
//     };

export class MaintainerManager<T, V extends string | number> {
    private readonly _maintainers;
    public constructor(private readonly _store: Store<T>) {
        this._maintainers = {
            preware: [] as MaintainerCallback<T, V>[],
        } as { [event_type in keyof Maintainer<T, V>]: MaintainerCallback<T, V>[] };
    }

    public register(m: Maintainer<T, V>): void {
        Object.keysIfValue(m).forEach((event_type) => {
            if (!this._maintainers[event_type]) this._maintainers[event_type] = [];
            // m[event_type] cannot be null since keysIfValue only return key if (m[key])
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._maintainers[event_type].push(m[event_type]!);
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public dispatch(type: V, data?: any): void {
        const maintainers = type !== `preware` ? this._maintainers[type] || [] : [];
        let current_state = this._store.getState();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const maintainer of [...this._maintainers.preware!, ...maintainers]) {
            const new_state = maintainer(current_state, data, type);
            if (!Object.is(new_state, current_state)) current_state = new_state;
        }
        this._store.updateStore(current_state);
    }
}
