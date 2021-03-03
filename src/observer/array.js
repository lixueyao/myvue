let oldArrayProperty = Array.prototype;
export let arrayMethods = Object.create(oldArrayProperty);

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
            default:
                break;
        }

        if(inserted) ob.observeArray(inserted);
    }
})
