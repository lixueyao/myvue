import { isObject } from "../util";
import { arrayMethods } from "./array";

class Observer {
    constructor (data) {
        //防止死循环、设置为不可枚举
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods;
            //数组中是对象类型需要监控
            this.observeArray(data);
        }else {
            this.walk(data);
        }
    }

    observeArray (data) {
        data.forEach(item => observe(item));
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

    //被监控过
    if (data.__ob__) {
        return;
    }

    return new Observer(data);
}