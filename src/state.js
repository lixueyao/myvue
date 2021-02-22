import { isFunction } from "./util";
import { observe } from './observer/index';

export function initSate (vm) {
    const opts = vm.$options;
    if (opts.data) {
        initData(vm);
    }
}

function initData (vm) {
    let data = vm.$options.data;

    data = vm._data = isFunction(data) ? data.call(vm) : data;

    observe(data);
}