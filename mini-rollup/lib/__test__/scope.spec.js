const Scope = require('../scope');
describe('scope', () => {
    it('基础父子关系', () => {
        /*  描述的情况如下:
            const a = 1;
            function fn(){
                const b = 2;
            }
         */
        const root = new Scope({});
        root.add('a');
        const child = new Scope({
            parent: root
        });
        child.add('b');

        // 在child作用域下查找a变量应当存在
        expect(child.contains('a')).toBe(true);
        expect(child.contains('b')).toBe(true);
        // a变量存在的作用域应当是 root
        expect(child.findDefiningScope('a')).toBe(root);
        expect(child.findDefiningScope('b')).toBe(child);
        expect(child.findDefiningScope('c')).toBe(null);
    });
})