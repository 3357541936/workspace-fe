const analyse = require('../analyse');
const acorn = require('acorn');
const MagicString = require('magic-string');

function getCode(code) {
    return {
        ast: acorn.parse(code, {
            ecmaVersion: 7,
        }),
        magicString: new MagicString(code),
    }
}

/**
 * _scope :作用域(全局作用域, 函数作用域)
 * _defines: 局部变量定义
 * _dependsOn: 变量依赖外部模块
 *
 * 以下为辅助打包使用
 * _included: 当前语句是否被引用过
 * _source: 当前语句内容
 */

describe('analyse', () => {
    it('_scope, _defines', () => {
        const {ast, magicString} = getCode('const a = 1;')

        analyse(ast, magicString);

        expect(ast._scope.contains('a')).toBe(true)
        expect(ast._scope.findDefiningScope('a')).toEqual(ast._scope)
        expect(ast.body[0]._defines).toEqual({a: true});
    });
    it('_dependsOn', () => {
        const {ast, magicString} = getCode('const a = 1;')

        analyse(ast, magicString);

        expect(ast.body[0]._dependsOn).toEqual({a: true})
    });
})