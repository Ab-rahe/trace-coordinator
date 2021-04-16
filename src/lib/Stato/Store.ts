export class Store<T> {
    public constructor(private _state: T, private readonly _old_state: T[] = []) {}

    public getState(): T {
        return this._state;
    }

    public getHistory(): T[] {
        return this._old_state;
    }

    public updateStore(new_state: T): void {
        this._old_state.push(this.getState());
        this._state = new_state;
    }
}
