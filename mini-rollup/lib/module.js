const acorn = require('acorn');
const MagicString = require('magic-string')
const analyse = require('./analyse');

const SYSTEM_VARS = ['console', 'log'];

class Module {
    constructor({code}) {
        this.code = new MagicString(code);
        this.ast = acorn.parse(code, {
            ecmaVersion: 7,
            sourceType: 'module',
        })
        this.analyse();
    }

    analyse() {
        this.imports = {};
        this.ast.body.forEach(node => {
            if (node.type === 'ImportDeclaration') {
                const source = node.source.value;
                const {specifiers} = node;
                specifiers.forEach(specifier => {
                    const localName = specifier.local.name;
                    const name = specifier.imported.name;
                    this.imports[localName] = {localName, name, source};
                })
            } else if (/^Export/.test(node.type)) {
                this.exports = {};
                const declaration = node.declaration;
                if (declaration.type === 'VariableDeclaration') {
                    if (!declaration.declarations) return false;
                    const localName = declaration.declarations[0].id.name;
                    this.exports[localName] = {
                        node,
                        expression: declaration,
                        localName
                    }
                }
            }
        })
        analyse(this.ast, this.code, this)

        this.definitions = {}
        this.ast.body.forEach(statement => {
            Object.keys(statement._defines).forEach(node => {
                this.definitions[node] = statement;
            })
        })
    }

    expandAllStatement() {
        const allStatements = [];
        this.ast.body.forEach(statement => {
            if (statement.type === 'ImportDeclaration') return false;
            if (statement.type === 'VariableDeclaration') return false;
            const statements = this.expandStatement(statement);
            allStatements.push(...statements);

        })
        return allStatements;
    }

    /**
     * 展开(扩展)单条语句, 输出内容: 声明+调用
     * @param statement
     */
    expandStatement(statement) {
        // 表示当前语句已经被引用了
        statement._included = true
        const result = [];
        const dependencies = Object.keys(statement._dependsOn);

        dependencies.forEach(name => {
            const definitions = this.define(name);
            result.push(...definitions)
        })
        result.push(statement);
        return result;
    }

    /**
     * 查找变量声明
     * @param name
     */
    define(name) {
        // import 模块外的内容
        if (has(this.imports, name)) {

        }
        // 自身模块的内容
        else {
            const statement = this.definitions[name];
            if (statement) {
                if (statement._included){
                    return [];
                }
                // 递归, 情况: const a = b + 1; 需要去寻找b的声明
                return this.expandStatement(statement);

            } else if (SYSTEM_VARS.includes(name)) {
                return [];
            } else {
                throw new Error(`没有此变量! ->>> ${name} <<<-`)
            }

        }
    }

}


function has(obj, prop) {
    return Object.prototype.hasOwnProperty(obj, prop)
    obj.hasOwnProperty(prop);
}

module.exports = Module;