const path = require('node:path');
const Module = require('./module');
const MagicString = require('magic-string');
const fs = require('node:fs')

class Bundle {
    constructor(options = {}) {
        this.entry = options.entry.replace(/\.js$/, '') + '.js';
        this.modules = [];
        this.statements = []
    }

    /**
     * 读取模块
     * @param importee 被调用者
     * @param importer 调用者
     */
    fetchModule(importee, importer) {
        let route;
        if (!importer) {
            // 主模块
            route = importee;
        } else {
            //路径转换: 计算相对于importer的路径
            if (path.isAbsolute(importee)) { // 绝对路径, 不需要计算
                route = importee;
            } else { // 相对路径
                route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js')
            }

        }

        if (route) {
            // 读取代码
            const code = fs.readFileSync(route, 'utf8').toString();
            const module = new Module({
                code,
                path: route,
                bundle: this
            });

            return module;
        }
    }

    build(outputFileName) {
        const entryModule = this.fetchModule(this.entry);
        this.statements = entryModule.expandAllStatement();
        const generate = this.generate();
        fs.writeFileSync(outputFileName,generate.code,'utf8')
    }

    generate() {
        const magicString = new MagicString.Bundle();
        this.statements.forEach(statement => {
            const source = statement._source.clone();
            // export const a = 1; 转换成 const a = 1;
            if (statement.type === 'ExportNamedDeclaration') {
                source.remove(statement.start, statement.declaration.start);
            }
            magicString.addSource({
                content: source,
                separator: '\n'
            })

        })
        return {code: magicString.toString()}
    }

}

module.exports = Bundle;