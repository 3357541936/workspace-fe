const Module = require('../module');
describe('module', () => {
    describe('constructor', () => {
        describe('imports', () => {
            it('single imports', () => {
                const code = `import {a as aa} from '../module'`;
                const module = new Module({code});

                expect(module.imports).toEqual({
                    aa: {
                        localName: 'aa',
                        name: 'a',
                        source: '../module'
                    }
                })
            });
        });
        describe('exports', () => {
            it('single exports ', () => {
                const code = `export const a = 1`;
                const module = new Module({code});

                expect(module.exports['a'].localName).toBe('a');
                expect(module.exports['a'].node).toBe(module.ast.body[0]);
                expect(module.exports['a'].expression).toBe(module.ast.body[0].declaration);

            });
        })
    });
    describe('definitions', () => {
        it('test for . ', () => {
            const code = `const a = 1;`
            const module = new Module({code});
            expect(module.definitions).toEqual({a: module.ast.body[0]});
        });
    })
})