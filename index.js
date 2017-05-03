var glob = require('glob')
var asink = require('async')
var fs = require('fs')
var cson = require('cson')
var mustache = require('mustache')
var mkdirp = require('mkdirp')
var exec = require('child_process').exec

var TEMPLATES = {
  front: 'template/front.svg',
  back: 'template/back.svg'
}

module.exports = function (options, cb) {
  var inputNames = options.name || '*'
  var inputDir = options.inputDir || 'input'
  var tmpDir = options.tmpDir || 'tmp'
  var outputDir = options.outputDir || 'output'

  asink.mapValues(TEMPLATES, function (path, key, cb) {
    fs.readFile(path, 'utf8', cb)
  }, function (er, templates) {
    if (er) return cb(er)
    glob(inputDir + '/' + inputNames + '.{cson,json}', function (er, matches) {
      if (er) return cb(er)
      asink.map(matches, function (match, cb) {
        cson.parseFile(match, cb)
      }, function (er, contexts) {
        if (er) return cb(er)
        var svgData
        try {
          svgData = contexts.map(function (context) {
            return {
              name: context.email,
              front: mustache.render(templates.front, context),
              back: mustache.render(templates.back, context)
            }
          })
        } catch (er) {
          return cb(er)
        }
        asink.map([tmpDir, outputDir], mkdirp, function (er) {
          if (er) return cb(er)
          asink.map(svgData, function (svgDatum, cb) {
            var frontSvgPath = tmpDir + '/' + svgDatum.name + '-front.svg'
            var backSvgPath = tmpDir + '/' + svgDatum.name + '-back.svg'
            asink.parallel([
              function (cb) {
                fs.writeFile(frontSvgPath, svgDatum.front, cb)
              },
              function (cb) {
                fs.writeFile(backSvgPath, svgDatum.back, cb)
              }
            ], function (er) {
              if (er) return cb(er)
              asink.parallel([
                function (cb) {
                  var frontPdfPath = outputDir + '/' + svgDatum.name + '-front.pdf'
                  exec('rsvg-convert -f pdf -o ' + frontPdfPath + ' ' + frontSvgPath, cb)
                },
                function (cb) {
                  var backPdfPath = outputDir + '/' + svgDatum.name + '-back.pdf'
                  exec('rsvg-convert -f pdf -o ' + backPdfPath + ' ' + backSvgPath, cb)
                }
              ], cb)
            })
          }, cb)
        })
      })
    })
  })
}
