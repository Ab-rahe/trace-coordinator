import { Store } from "./Store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MaintainerCallback<T, V> = (state: T, data?: any, type?: V) => T;
export type Maintainer<T, V extends string | number> = {
    preware?: MaintainerCallback<T, V>;
} & {
    [t in V]?: MaintainerCallback<T, V>;
};

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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._maintainers[event_type].push(m[event_type]!);
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public dispatch(type: V, data?: any): void {
        let maintainers = this._maintainers[type];
        if (!maintainers) maintainers = [];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const maintainer of [...this._maintainers.preware!, ...maintainers]) {
            const new_state = maintainer(this._store.getState(), data, type);
            if (!Object.is(new_state, this._store.getState())) this._store.updateStore(new_state);
        }
    }
}
