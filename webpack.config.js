var path = require('path');

var distpath = path.resolve(__dirname, 'dist');

var rules = [
    {
        test: /.*\.css$/,
        use: [ 'style-loader', 'css-loader' ]
    }
];

var nohInsectsConfig = {
    mode: 'production',
    entry: './src/noh_insects.js',
    output: { path: distpath, filename: 'noh_insects.js', library: "noh-insects", libraryTarget: "umd" },
    module: { rules: rules }
};

var nohInsectsTestsConfig = {
    mode: 'production',
    entry: './src/noh_insects_tests.js',
    output: { path: distpath, filename: 'noh_insects_tests.js' },
    module: { rules: rules }
};

var nohInsectsDemoConfig = {
    mode: 'development',
    entry: './src/noh_insects_demo.js',
    output: { path: distpath, filename: 'noh_insects_demo.js' },
    module: { rules: rules }
};


module.exports = [nohInsectsConfig, nohInsectsTestsConfig, nohInsectsDemoConfig];
