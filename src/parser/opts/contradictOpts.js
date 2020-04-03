const transformOpts = require('./transformOpts')
const {contradictionDetected, wrongContradictsType} = require('../../errors')

module.exports = transformOpts(opt => doesContradict(opt) && willHaveValues(opt))((opt, _, opts) => {
  const errs = []

  const {key, contradicts: keys} = opt

  if (Array.isArray(keys)) {
    if (opts.some(opt2 => keys.indexOf(opt2.key) > -1 && willHaveValues(opt2))) {
      errs.push(contradictionDetected({key, contradicts: keys, option: opt}))
    }
  } else {
    errs.push(wrongContradictsType({key, type: typeof keys, option: opt}))
  }

  return {errs}
})

function doesContradict ({contradicts}) {
  return typeof contradicts !== 'undefined'
}

function willHaveValues ({values, defaultValues}) {
  return typeof values !== 'undefined' || typeof defaultValues !== 'undefined'
}