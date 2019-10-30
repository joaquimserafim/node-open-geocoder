/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/
'use strict'

const https              = require('https')
const parse              = require('json-parse-safe')
const isValidCoordinates = require('is-valid-coordinates')
const isObject           = require('is.object')
const qs                 = require('qs')
const getPropValue       = require('get-property-value')

class Geocoder {

  constructor (options) {
    this.format = '&format=json'
    this.httpOptions = {
      hostname: getPropValue(options, 'url') || 'nominatim.openstreetmap.org',
      basePath: getPropValue(options, 'basePath') || '',
      port: getPropValue(options, 'port') || 443,
      agent: false,
      headers: {
        'User-Agent': getPropValue(options, 'userAgent') || 'node-open-geocoder'
      }
    }
    this.timeout = getPropValue(options, 'timeout') || 10000
  }

  geocode (addr, options) {
    const callOptions = isObject(options)
      ? `&${qs.stringify(options)}`
      : '&addressdetails=1&polygon_geojson=1'

    this.httpOptions.path = '/search?q=' +
      encodeURI(addr.replace(/ /g, '+')) +
      callOptions +
      this.format

    return this
  }

  reverse (lon, lat) {
    if (!isValidCoordinates(lon, lat)) {
      softOverrideMethod(this, 'end', (cb) => {
        cb(new Error('Invalid coordinates!'))
      })
    } else {
      this.httpOptions.path =
        `/reverse?lon=${lon}&lat=${lat}${this.format}&addressdetails=1`
    }

    return this
  }

  end (cb) {
    const req = https.get(this.httpOptions, responseHandler.bind(this, cb))

    req.setTimeout(this.timeout, timeoutCb)

    req.once('error', onError)

    function timeoutCb () {
      this.timedout = true
      this.abort()
    }

    function onError (err) {
      err = this.timedout
        ? timeoutError(err.message, this.socket.timeoutMs)
        : err

      cb(err)
    }
  }

}

module.exports = function geocoderExports (url) {
  return new Geocoder(url)
}

//
// help functions
//

function responseHandler (handler, res) {
  const statusCode = res.statusCode
  const contentType = res.headers['content-type']

  let error

  if (statusCode !== 200) {
    error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`)
  }

  if (error) {
    res.resume()
    return handler(error)
  }

  res.setEncoding('utf8')

  let rawData = ''

  res
    .on('data', onData)
    .once('end', onEnd)

  function onData (chunk) {
    rawData += chunk
  }

  function onEnd () {
    const json = parse(rawData)

    return json.error
      ? handler(json.error)
      : handler(null, json.value)
  }
}

function timeoutError (reason, timeout) {
  const err = new Error(`${reason} ${timeout}ms exceeded`)
  err.timeout = timeout
  err.code = 'ECONNABORTED'

  return err
}

function softOverrideMethod (self, methodName, newMethod) {
  self[methodName] = newMethod
}
