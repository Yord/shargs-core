const {brs} = require('./brs')

test('brs generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = brs(2)(style)

  const txt = '                                        \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('brs with default length generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = brs()(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})