const fs = require('node:fs');
const acorn = require('acorn');
const MagicString = require('magic-string');

const code = fs.readFileSync('../source.js').toString();

const ast = acorn.parse(code, {
    sourceType: "module",
    ecmaVersion: 7
})

// console.log(ast)

// 第一次遍历: 查找变量声明
const declarations = {}
ast.body
    .filter(v => v.type === 'VariableDeclaration')
    .map(v => {
        // console.log("检测声明", v.declarations[0].id.name)
        declarations[v.declarations[0].id.name] = v;
    })

// console.log(declarations);

// 第二次遍历: 处理非声明代码部分 (例:将声明放在调用前)
const statements = [];
ast.body
    .filter(v => v.type !== 'VariableDeclaration')
    .map(v => {
        // console.log("Expression原变量",v.expression.callee.name)
        statements.push(declarations[v.expression.callee.name]);
        statements.push(v)
    })

// console.log(statements);

// TreeShaking 生成最后代码
const m = new MagicString(code);

console.log("=================================")
statements.map(node => {
    // 通过AST分析后的语句起始生成代码;
    console.log(m.snip(node.start, node.end).toString());
})
console.log("=================================")