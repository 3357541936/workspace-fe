const process = require('node:process');
if (!/pnpm/.test(process.env.npm_execpath || '')) {
    console.warn(`\u001b[33m Please Use PNPM CLI! \u001b[39m\n`)
    process.exit(1)
}