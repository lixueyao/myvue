(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    function compileToFunction(template) {
        console.log('compile');
    }

    function isFunction (val) {
        return typeof val === 'function';
    }

    function isObject (val) {
        return typeof val === 'object' && val !== null;
    }

    let oldArrayProperty = Array.prototype;
    let arrayMethods = Object.create(oldArrayProperty);

    let methods = [
        'push',
        'shift',
        'unshift',
        'reverse',
        'pop',
        'sort',
        'splice'
    ];

    methods.forEach(method => {
        arrayMethods[method] = function (...args) {
            oldArrayProperty[method].call(this, ...args);
            //监听调用方法时对数组的添加
            let inserted;
            let ob = this.__ob__;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
                    break;
            }

            if(inserted) ob.observeArray(inserted);
        };
    });

    class Observer {
        constructor (data) {
            //防止死循环、设置为不可枚举
            Object.defineProperty(data, '__ob__', {
                value: this,
                enumerable: false
            });
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

        //被监控过
        if (data.__ob__) {
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

    function proxy (vm, source, key) {
        Object.defineProperty(vm, key, {
            get () {
                return vm[source][key];
            },
            set (newValue) {
                vm[source][key] = newValue;
            }
        });
    }

    function initData (vm) {
        let data = vm.$options.data;

        data = vm._data = isFunction(data) ? data.call(vm) : data;

        for (let key in data) {
            console.log(key);
            proxy(vm, '_data', key);
        }

        observe(data);
    }

    function initMixin (Vue) {
        Vue.prototype._init = function (options) {
            const vm = this;
            vm.$options = options;

            //对数据进行初始化 watch、props ...
            initSate(vm);

            if(vm.$options.el) {
                vm.$mount(vm.$options.el);
            }
        };

        Vue.prototype.$mount = function (el) {
            const vm = this;
            const options = vm.$options;
            el = document.querySelector(el);
            
            if(!options.render) {
                let template = options.template;
                if (! template && el) {
                    template = el.outHTML;
                    let render = compileToFunction();
                    options.render = render;
                }
            }
        };
    }

    function Vue(options) {
        this._init(options); 
    }

    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=index.js.map
