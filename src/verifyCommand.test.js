const {verifyCommand} = require('./verifyCommand')
const {
  CommandExpected,
  InvalidArgs,
  InvalidKey,
  InvalidOpts,
  InvalidTypes,
  InvalidNestedCommand,
  OptionExpected,
  PosArgExpected,
  SubcommandExpected,
  UnknownCommandLineOptionType
} = require('./errors')

test('verifyCommand works for empty programs', () => {
  const opt = {
    key: 'foo',
    opts: []
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [],
    opt
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs without key', () => {
  const opt = {
    key: undefined,
    opts: []
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt})],
    opt
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs with wrong key syntax', () => {
  const opt = {
    key: null,
    opts: []
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt}), InvalidKey({opt})]
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs that have a whitespace in their key', () => {
  const opt = {
    key: 'foo bar',
    opts: []
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt}), InvalidKey({opt})]
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs without opts', () => {
  const opt = {
    key: 'foo',
    opts: undefined
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt})],
    opt
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs with wrong opts syntax', () => {
  const opt = {
    key: 'foo',
    opts: 'bar'
  }

  // @ts-ignore
  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt}), InvalidOpts({opt})]
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for nested programs with wrong opts syntax', () => {
  const bar = {
    key: 'bar',
    opts: []
  }

  const opt = {
    key: 'foo',
    opts: [
      bar
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [InvalidNestedCommand({opt: bar})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand works for programs with options', () => {
  const flagOption      = {key: 'flagOption',      args: ['-a'], types: []}
  const primitiveOption = {key: 'primitiveOption', args: ['-b'], types: ['A']}
  const arrayOption     = {key: 'arrayOption',     args: ['-c'], types: ['A', 'B']}
  const variadicOption  = {key: 'variadicOption',  args: ['-d']}
  const primitivePosArg = {key: 'primitivePosArg',               types: ['A']}
  const arrayPosArg     = {key: 'arrayPosArg',                   types: ['A', 'B']}
  const variadicPosArg  = {key: 'variadicPosArg'}
  const subcommand      = {key: 'subcommand',      args: ['-e'],                    opts: []}

  const opt = {
    key: 'foo',
    opts: [
      flagOption,
      primitiveOption,
      arrayOption,
      variadicOption,
      primitivePosArg,
      arrayPosArg,
      variadicPosArg,
      subcommand
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [],
    opt
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for opts with invalid key', () => {
  const foo = {key: null, args: ['-a'], types: []}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [OptionExpected({opt: foo}), InvalidKey({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for opts with invalid key due to whitespaces', () => {
  const foo = {key: 'foo bar', args: ['-a'], types: []}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [OptionExpected({opt: foo}), InvalidKey({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for opts with invalid args', () => {
  const foo = {key: 'arc', args: null, types: []}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [OptionExpected({opt: foo}), InvalidArgs({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for opts with invalid args due to whitespaces', () => {
  const foo = {key: 'arc', args: ['foo bar'], types: []}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [OptionExpected({opt: foo}), InvalidArgs({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for subcommands with invalid args', () => {
  const foo = {key: 'arc', args: null, opts: []}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [SubcommandExpected({opt: foo}), InvalidArgs({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for subcommands with invalid opts', () => {
  const foo = {key: 'foo', args: ['foo'], opts: null}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [SubcommandExpected({opt: foo}), InvalidOpts({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for invalid option types', () => {
  const foo = {foo: 'bar'}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [UnknownCommandLineOptionType({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for pos args with invalid types', () => {
  const foo = {key: 'arc', types: null}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [PosArgExpected({opt: foo}), InvalidTypes({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for opts with invalid types', () => {
  const foo = {key: 'arc', args: ['-a'], types: null}

  const opt = {
    key: 'foo',
    opts: [
      foo
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [OptionExpected({opt: foo}), InvalidTypes({opt: foo})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand removes only incorrect options from opts', () => {
  const arc = {key: 'arc', args: ['-a'], types: []}
  const bar = {key: 'bar', args: ['-b'], types: null}
  const cat = {key: 'cat', args: ['-c'], types: []}
  
  const opt = {
    key: 'foo',
    opts: [
      arc,
      bar,
      cat
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [OptionExpected({opt: bar}), InvalidTypes({opt: bar})],
    opt: {...opt, opts: [
      arc,
      cat
    ]}
  }

  expect(res).toStrictEqual(exp)
})