const {noArgumentProvidedInOption, noArgumentsProvidedInOption} = require('../../errors')

module.exports = (options = {}) => {
  const {key = null, args = [], types = null, only = null, desc = '', opts = null} = options

  const errs  = []
  const args2 = {}

  if (key === null) {
    errs.push(noArgumentProvidedInOption({options}))
  }
  
  if (args === null || args.length === 0) {
    errs.push(noArgumentsProvidedInOption({options}))
  }
  
  if (key !== null && args !== null && args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      const arg  = args[i]
      if (typeof args2[arg] === 'undefined') args2[arg] = []
      args2[arg].push({key, types, only, desc, opts})
    }
  }

  return {errs, args: args2}
}