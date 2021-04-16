export {};

declare global {
    interface Object {
        // hasOwnProperty<K extends PropertyKey>(key: K): this is Record<K, unknown>;
        keysIfValue<T extends string | number>(object: { [key in T]: unknown }): T[];
    }
}

Object.keysIfValue = function (object) {
    const keys = [];
    for (const key in object) {
        if (object[key]) keys.push(key);
    }
    return keys;
};
