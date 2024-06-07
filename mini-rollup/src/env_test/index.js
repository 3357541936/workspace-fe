const path = require('path');
const rollup = require('../bundle');
const entry = path.resolve(__dirname,'./main.js');
rollup(entry,'./bundle.js');