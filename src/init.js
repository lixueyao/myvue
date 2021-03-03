import { compileToFunction } from './compiler/index.js';
import { initSate } from './state';

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;

        //对数据进行初始化 watch、props ...
        initSate(vm);

        if(vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        
        if(!options.render) {
            let template = options.template;
            if (! template && el) {
                template = el.outHTML;
                let render = compileToFunction(template);
                options.render = render;
            }
        }
    }
}