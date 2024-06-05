const acorn = require('acorn');
const MagicString = require('magic-string')
const analyse = require('./analyse');

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
            analyse(this.ast, this.code, this)

            this.definitions = {}
            this.ast.body.forEach(statement => {
                Object.keys(statement._defines).forEach(node => {
                    this.definitions[node] = statement;
                })
            })
        })
    }

}

module.exports = Module;