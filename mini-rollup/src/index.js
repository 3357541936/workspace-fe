const fs = require('node:fs');
const acorn = require('acorn');
const MagicString = require('magic-string');

const code = fs.readFileSync('../source.js').toString();

const ast = acorn.parse(code, {
    locations: true,
    ranges:true,
    sourceType: "module",
    ecmaVersion: 7
})

// console.log(ast)

const walk = require('../lib/walk');

// 作用域缩进
let indent = 0;

// 开始对语法树进行分析
walk(ast, {
    enter(node) {
        // 变量声明
        if(node.type === 'VariableDeclaration'){
            console.log('%s Var:', (' ').repeat(indent * 4), node.declarations[0].id.name);
        }

        // 函数声明
        if(node.type === 'FunctionDeclaration'){
            console.log('%s Fun:', (' ').repeat(indent * 4), node.id.name);
            // 代表进入函数, 新增一层作用域
            indent ++;
        }
    },
    leave(node) {
        if(node.type === 'FunctionDeclaration'){
            // 函数作用域结束, 减少一层作用域
            indent --;
        }
    }
})
