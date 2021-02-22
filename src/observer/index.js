import { isObject } from "../util";

class Observer {
    constructor (data) {
        this.walk(data);
    }

    walk (data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

function defineReactive (data, key, value) {
    observe(value)
    Object.defineProperty(data, key, {
        get () {
            return value;
        },
        set (newV) {
            observe(newV);
            value = newV;
        }
    })
}

export function observe (data) {
    if (!isObject(data)) {
        return;
    }

    return new Observer(data);
}