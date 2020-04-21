#!/usr/bin/env node

import cp from 'child_process';
import path from 'path';
import { endTests } from '../test-utils/test.js';

const find = cp.spawn('find', ['./', '-name', '*.test.js']);
//const run_tests = cp.spawn('node', ['--verbose']);

//find.stdout.pipe(run_tests.stdin);
// find ./src -name '*.test.js' | xargs node//mocha -R spec
const tests = [];

find.stdout.on('data', data => {
  const paths = data.toString().split("\n")
    .filter(p => p);;
  console.log('PATHS ', paths);
  paths.forEach(pathStr => {
    const modulePath = path.join(process.cwd(), pathStr);
    tests.push(import(modulePath));
  });
});

//find.on('exit', (code, signal) => {
//  console.log('TESTS DONE ', code, ' :', signal);
//  //endTests();
//});

find.on('close', (code) => {
  Promise.all(tests)
    .then(() => {
      console.log('\n FINISHED');
      endTests();
    });
});

//endTests();

console.log('running tests...');

