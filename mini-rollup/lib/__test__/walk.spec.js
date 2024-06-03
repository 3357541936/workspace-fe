const walk = require('../walk');

describe('测试 walk 函数', () => {
    it('情况:单节点', () => {
        const ast = {
            a: 1
        }

        // 虚拟生成的方法,并记录调用情况
        const enter = jest.fn();
        const leave = jest.fn();

        // 用例执行
        walk(ast, {enter, leave});

        // enter调用的结果
        const enterCalls = enter.mock.calls;
        expect(enterCalls.length).toBe(1);
        expect(enterCalls[0][0]).toEqual({a: 1});

        // leave调用的结果
        const leaveCalls = leave.mock.calls;
        expect(leaveCalls.length).toBe(1);
        expect(leaveCalls[0][0]).toEqual({a: 1})
    });

    it('情况:多节点', () => {
        const ast = {
            a: {b: 1},
            c: {d: 2}
        }

        // 虚拟生成的方法,并记录调用情况
        const enter = jest.fn();
        const leave = jest.fn();

        // 用例执行
        walk(ast, {enter, leave});

        // enter调用的结果
        const enterCalls = enter.mock.calls;
        expect(enterCalls.length).toBe(3);
        expect(enterCalls[0][0]).toEqual({a: {b: 1}, c: {d: 2}});
        expect(enterCalls[1][0]).toEqual({b: 1});
        expect(enterCalls[2][0]).toEqual({d: 2});

        // leave调用的结果
        const leaveCalls = leave.mock.calls;
        expect(leaveCalls.length).toBe(3);
        expect(leaveCalls[0][0]).toEqual({b: 1});
        expect(leaveCalls[1][0]).toEqual({d: 2});
        expect(leaveCalls[2][0]).toEqual({a: {b: 1}, c: {d: 2}});
    });

    it('情况:包含数组的节点', () => {
        const ast = {a: [{b: 2}]}

        // 虚拟生成的方法,并记录调用情况
        const enter = jest.fn();
        const leave = jest.fn();

        // 用例执行
        walk(ast, {enter, leave});

        // enter调用的结果
        const enterCalls = enter.mock.calls;
        expect(enterCalls.length).toBe(3);
        expect(enterCalls[0][0]).toEqual({a: [{b: 2}]});
        expect(enterCalls[1][0]).toEqual([{b: 2}]);
        expect(enterCalls[2][0]).toEqual({b: 2});

        // leave调用的结果
        const leaveCalls = leave.mock.calls;
        expect(leaveCalls.length).toBe(3);
        expect(leaveCalls[0][0]).toEqual({b: 2});
        expect(leaveCalls[1][0]).toEqual([{b: 2}]);
        expect(leaveCalls[2][0]).toEqual({a: [{b: 2}]});
    });
});