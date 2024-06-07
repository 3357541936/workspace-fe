const Bundle = require('../bundle');
const fs = require('node:fs');

jest.mock('node:fs');

describe('Bundle Test', () => {
    describe('FetchModule', () => {
        it('basic', () => {
            const bundle = new Bundle({entry:'./a.js'});
            // fs.readFileSync
            fs.readFileSync.mockReturnValueOnce('const a = 1;');

            bundle.fetchModule('index.js');

            const {calls} = fs.readFileSync.mock;
            expect(calls[0][0]).toBe('index.js');


        });
    });
    describe('Build',()=>{
        it('basic', () => {
            const bundle = new Bundle({entry:'index.js'});
            fs.readFileSync.mockReturnValueOnce('console.log(1);');
            const module = bundle.build('bundle.js');
            const {calls } = fs.writeFileSync.mock;
            expect(calls[0][0]).toBe('bundle.js');
            expect(calls[0][1]).toBe('console.log(1);');
        })
        it('modules_loading', () => {
            const bundle = new Bundle({entry:'index.js'});
            fs.readFileSync.mockReturnValueOnce(`import {b} from 'a.js'; 
            b();`)
                .mockReturnValueOnce('export const b = () => 1;');
            // fs.readFileSync.mock.calls = [];
            bundle.build('out.js');
            const {calls} = fs.writeFileSync.mock;
            expect(calls[0][0]).toBe('out.js');
            expect(calls[0][1]).toBe(`const b = () => 1;\nb();`);

        });
    })
});