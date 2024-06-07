const Scope = require('./scope');
const walk = require("./walk");

/**
 * 分析函数
 * @param ast
 * @param magicString
 * @param module
 */
function analyse(ast, magicString, module) {
    // 构造全局作用域
    let scope = new Scope();

    ast.body.forEach((statement) => {
        /**
         * 向作用域添加变量
         * @param declaration 声明节点
         */
        function addToScope(declaration) {
            const name = declaration.id.name;
            scope.add(name);
            if (!scope.parent) {
                statement._defines[name] = true;
            }
        }

        Object.defineProperties(statement, {
            _defines: {value: {}},
            _dependsOn: {value: {}},
            _included: {value: false, writable: true},
        })

        walk(statement, {
            enter(node) {
                let newScope;
                switch (node.type) {
                    // 变量声明
                    case 'VariableDeclaration':
                        node.declarations.forEach(addToScope);
                        break;
                    // 函数声明
                    case 'FunctionDeclaration':
                        // 加入当前作用域中
                        addToScope(node);
                        // 处理函数参数
                        const param = node.params.map(v => v.name);
                        // 创建新的作用域
                        newScope = new Scope({
                            parent: scope,
                            param
                        });
                        break;
                    // 其他情况
                    default:
                        break;
                }
                if (newScope) {
                    Object.defineProperties(node, {
                        _scope: {value: newScope}
                    })
                    scope = newScope;
                }
            },
            leave(node) {
                if (node._scope) {
                    scope = scope.parent;
                }
            }
        })
    })
    ast._scope = scope;

    ast.body.forEach((statement) => {
        walk(statement, {
            enter(node) {
                if (node.type === 'Identifier') {
                    statement._dependsOn[node.name] = true
                }
            }
        })
    })
}

module.exports = analyse;