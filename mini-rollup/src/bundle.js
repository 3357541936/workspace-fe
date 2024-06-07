const Bundle = require('../lib/bundle');

function rollup(entry, outputFileName) {
    const bundle = new Bundle({entry});
    bundle.build(outputFileName);

}
module.exports = rollup;
