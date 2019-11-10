let fs = require('fs');
let path = require('path');
let slsw = require('serverless-webpack');

module.exports = {
    mode: 'development',
    entry: slsw.lib.entries,
    node: { __filename: true, __dirname: true },
    externals: getExternals(),
    resolve: {
        modules: ['node_modules', 'web_modules'],
        extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: {
            when: path.join(__dirname, 'node_modules', 'when', 'dist', 'browser', 'when.min.js')
        }
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    target: 'node',
    //   module: {
    //     rules: [
    //       { test: /\.ts(x?)$/, loader: 'ts-loader' },
    //       {
    //         exclude: /node_modules/,
    //         test: /\.graphql$/,
    //         use: [{ loader: 'graphql-import-loader' }]
    //       }
    //     ]
    //   },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                include: [__dirname],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
    ]
};


function getExternals() {
    let content = fs.readFileSync(__dirname + '/package.json').toString();
    let pkg = JSON.parse(content);
    return pkg.externals;
}
