(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    function isFunction (val) {
        return typeof val === 'function';
    }

    function isObject (val) {
        return typeof val === 'object' && val !== null;
    }

    class Observer {
        constructor (data) {
            this.walk(data);
        }

        walk (data) {
            Object.keys(data).forEach(key => {
                defineReactive(data, key, data[key]);
            });
        }
    }

    function defineReactive (data, key, value) {
        observe(value);
        Object.defineProperty(data, key, {
            get () {
                return value;
            },
            set (newV) {
                observe(newV);
                value = newV;
            }
        });
    }

    function observe (data) {
        if (!isObject(data)) {
            return;
        }

        return new Observer(data);
    }

    function initSate (vm) {
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

    function initMixin (Vue) {
        Vue.prototype._init = function (options) {
            const vm = this;
            vm.$options = options;

            //对数据进行初始化 watch、props ...
            initSate(vm);
        };
    }

    function Vue(options) {
        this._init(options); 
    }

    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=index.js.map
