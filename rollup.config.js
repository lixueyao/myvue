import babel from 'rollup-plugin-babel';

export default {
    input: "./src/index.js",
    output: {
        format: "umd",
        name: "Vue",
        file: "./dist/index.js",
        sourcemap: true
    },
    plugin: {
        babel:[{
            exclude: "node_modules/**"
        }]
    }
}