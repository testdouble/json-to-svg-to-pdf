#!/usr/bin/env node

var jsonToSvgToPdf = require('./index')
var argv = require('minimist')(process.argv.slice(2))

jsonToSvgToPdf(argv, function (er) {
  if (er) {
    console.error('Something went wrong!')
    throw er
  }
})
