import fs from 'fs'
import p from 'path'

import jscodeshift from 'jscodeshift'
import expect from 'expect'

const read = fileName => fs.readFileSync(
  p.join('./tests/fixtures', fileName),
  'utf8'
)

const test = (transformName, testFileName, options) => {
  let path = testFileName + '.js';
  const source = read(testFileName + '.js');
  const output = read(testFileName + '.output.js');
  const transform = require(
    p.resolve('./transforms/', transformName)
  ).default;

  expect(
    (transform({ path, source }, { jscodeshift }, options || {}) || '').trim()
  ).toEqual(
    output.trim()
  )
}

describe("Ember Codemods", () => {
  it("Ember Component: Default Layout", () => {
    test('default-layout', 'default-layout.test')
  })

  it("Initialize Arity", () => {
    test('initializer-arity-2', 'initializer-arity.test')
  })
})

// console.log(p.join('./transforms/', 'default-layout'))
