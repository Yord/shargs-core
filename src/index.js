const {fromArgs}           = require('./fromArgs')
const {parser, parserSync} = require('./parser')
const {toArgs}             = require('./toArgs')
const {toArgv}             = require('./toArgv')
const {toOpts}             = require('./toOpts')

module.exports = {
  fromArgs,
  parser,
  parserSync,
  toArgs,
  toArgv,
  toOpts
}