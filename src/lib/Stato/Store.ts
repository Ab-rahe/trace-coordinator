export class Store<T> {
    public constructor(private _state: T, private readonly _old_states: T[] = []) {}

    public getState(): T {
        return this._state;
    }

    public getHistory(): T[] {
        return this._old_states;
    }

    public updateStore(new_state: T): void {
        this._old_states.push(this.getState());
        this._state = new_state;
    }
}
