const noCommands = require('./noCommands')
const {command, flag, number} = require('../../../options')

const id = opts => opts

test('noCommands filters one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 2))
})

test('noCommands filters more than one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 1))
})

test('noCommands returns an empty list if opts are empty', () => {
  const opts = []

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual([])
})

test('noCommands returns an empty list if opts are undefined', () => {
  const res = noCommands(id)()

  expect(res).toStrictEqual([])
})