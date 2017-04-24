/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/
'use strict'

const mocha   = require('mocha')
const nock    = require('nock')
const expect  = require('chai').expect
const repeat  = require('repeat-element')

const it        = mocha.it
const describe  = mocha.describe
const afterEach = mocha.afterEach

const openGeocoder = require('..')

const openMapUrl = 'http://nominatim.openstreetmap.org:80'

const mocks = {
  gecode_200: require('./mocks/geocode_200'),
  reverse_200: require('./mocks/reverse_200')
}

var scope

describe('node-open-geocoder', () => {

  afterEach((done) => {
    scope && expect(scope.isDone()).to.be.true
    done()
  })

  it('should throw an error when gets an ECONNREFUSED', (done) => {
    openGeocoder({url: 'localhost'})
      .geocode('135 pilkington avenue, birmingham')
      .end((err, res) => {
        expect(err).to.exist
        expect(err.message).to.be
          .equal('connect ECONNREFUSED 127.0.0.1:80')
        expect(err.code).to.be.equal('ECONNREFUSED')
        expect(res).to.not.exist
        // let's disable the network for the remaining tests
        nock.disableNetConnect()
        done()
      })
  })

  it('should throw an error when OpenStreetMap returns an error', (done) => {
    scope = nock(openMapUrl)
      .defaultReplyHeaders({'Content-Type': 'application/json'})
      .get('/search')
      .query({
        q: '135 pilkington avenue, birmingham',
        addressdetails: 1,
        'polygon_geojson': 1,
        format: 'json'
      })
      .reply(400)

    openGeocoder()
      .geocode('135 pilkington avenue, birmingham')
      .end((err, res) => {
        expect(err).to.exist
        expect(err.message).to.be.equal('Request Failed.\nStatus Code: 400')
        expect(res).to.not.exist
        done()
      })
  })

  it('should throw an error when OpenStreetMap returns an ' +
    'invalid JSON payload',
    (done) => {
      scope = nock(openMapUrl)
        .defaultReplyHeaders({'Content-Type': 'application/json'})
        .get('/search')
        .query({
          q: '135 pilkington avenue, birmingham',
          addressdetails: 1,
          'polygon_geojson': 1,
          format: 'json'
        })
        .reply(200, 'bad json')

      openGeocoder()
        .geocode('135 pilkington avenue, birmingham')
        .end((err, res) => {
          expect(err).to.exist
          expect(err.message).to.be.deep
            .equal('Unexpected token b in JSON at position 0')
          done()
        })
    }
  )

  it('should throw an error when OpenStreetMap returns an ' +
    'bad content-type',
    (done) => {
      scope = nock(openMapUrl)
        .defaultReplyHeaders({'Content-Type': 'text/html'})
        .get('/search')
        .query({
          q: '135 pilkington avenue, birmingham',
          addressdetails: 1,
          'polygon_geojson': 1,
          format: 'json'
        })
        .reply(200, 'bad json')

      openGeocoder()
        .geocode('135 pilkington avenue, birmingham')
        .end((err, res) => {
          expect(err).to.exist
          expect(err.message).to.be.deep
            .equal('Invalid content-type.\nExpected application/json ' +
              'but received text/html')
          done()
        })
    }
  )

  it('should be possible to use a different port', (done) => {
    scope = nock(openMapUrl.replace('80', '8000'))
      .defaultReplyHeaders({'Content-Type': 'application/json'})
      .get('/search')
      .query({
        q: '135 pilkington avenue, birmingham',
        addressdetails: 1,
        'polygon_geojson': 1,
        format: 'json'
      })
      .reply(200, mocks.gecode_200)

    openGeocoder({port: 8000})
      .geocode('135 pilkington avenue, birmingham')
      .end((err, res) => {
        expect(err).to.not.exist
        expect(res).to.be.deep.equal(mocks.gecode_200)
        done()
      })
  })

  it('should returns a valid response for a valid gecode', (done) => {
    scope = nock(openMapUrl)
      .defaultReplyHeaders({'Content-Type': 'application/json'})
      .get('/search')
      .query({
        q: '135 pilkington avenue, birmingham',
        addressdetails: 1,
        'polygon_geojson': 1,
        format: 'json'
      })
      .reply(200, mocks.gecode_200)

    openGeocoder()
      .geocode('135 pilkington avenue, birmingham')
      .end((err, res) => {
        expect(err).to.not.exist
        expect(res).to.be.deep.equal(mocks.gecode_200)
        done()
      })
  })

  it('should returns a valid response for a valid gecode with ' +
    'different geocoding options',
    (done) => {
      scope = nock(openMapUrl)
        .defaultReplyHeaders({'Content-Type': 'application/json'})
        .get('/search')
        .query({
          q: '135 pilkington avenue, birmingham',
          addressdetails: 0,
          format: 'json'
        })
        .reply(200, mocks.gecode_200)

      openGeocoder()
        .geocode('135 pilkington avenue, birmingham', {addressdetails: 0})
        .end((err, res) => {
          expect(err).to.not.exist
          expect(res).to.be.deep.equal(mocks.gecode_200)
          done()
        })
    }
  )

  it('should throw an error for bad coordinateswhen doing a reverse gecode',
    (done) => {
      openGeocoder()
        .reverse('-8.945406', 38.575078)
        .end((err, res) => {
          expect(err).to.exist
          expect(err.message).to.be.deep.equal('Invalid coordinates!')
          done()
        })
    }
  )

  it('should returns a valid response for a valid reverse gecode',
    (done) => {
      scope = nock(openMapUrl)
        .defaultReplyHeaders({'Content-Type': 'application/json'})
        .get('/reverse')
        .query({
          lon: -8.945406,
          lat: 38.575078,
          addressdetails: 1,
          format: 'json'
        })
        .reply(200, mocks.reverse_200)

      openGeocoder()
        .reverse(-8.945406, 38.575078)
        .end((err, res) => {
          expect(err).to.not.exist
          expect(res).to.be.deep.equal(mocks.reverse_200)
          done()
        })
    }
  )

  it('should return a valid response with a big payload',
    (done) => {
      const bigPayload = repeat(mocks.reverse_200, 500)

      scope = nock(openMapUrl)
        .defaultReplyHeaders({'Content-Type': 'application/json'})
        .get('/reverse')
        .query({
          lon: -8.945406,
          lat: 38.575078,
          addressdetails: 1,
          format: 'json'
        })
        .reply(200, bigPayload)

      openGeocoder()
        .reverse(-8.945406, 38.575078)
        .end((err, res) => {
          expect(err).to.not.exist
          expect(res).to.be.deep.equal(bigPayload)
          done()
        })
    }
  )

  it('should throw an error when OpenStreetMap returns a bad payload',
    (done) => {
      scope = nock(openMapUrl)
        .defaultReplyHeaders({'Content-Type': 'application/json'})
        .get('/reverse')
        .query({
          lon: -8.945406,
          lat: 38.575078,
          addressdetails: 1,
          format: 'json'
        })
        .reply(200)

      openGeocoder()
        .reverse(-8.945406, 38.575078)
        .end((err, res) => {
          expect(err).to.exist
          expect(err.message).to.be.deep
            .equal('Unexpected end of JSON input')
          done()
        })
    }
  )

  it('should throw an error when gets a socket timeout',
    (done) => {
      scope = nock(openMapUrl)
        .defaultReplyHeaders({'Content-Type': 'application/json'})
        .get('/reverse')
        .query({
          lon: -8.945406,
          lat: 38.575078,
          addressdetails: 1,
          format: 'json'
        })
        .socketDelay(100)
        .reply(200)

      openGeocoder({timeout: 50})
        .reverse(-8.945406, 38.575078)
        .end((err, res) => {
          expect(err).to.exist
          expect(err.message).to.be.equal('socket hang up 50ms exceeded')
          expect(err.code).to.be.equal('ECONNABORTED')
          expect(err.timeout).to.be.equal(50)
          done()
        })
    }
  )
})
