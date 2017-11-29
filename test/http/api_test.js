var request = require('supertest');
var assert = require('assert');

const mlkccaEndpoint = 'https://pubsub1.mlkcca.com'
const pushURL = '/api/push/demo/demo?c=apitest'
const onPushURL = '/on/push/demo/demo?c=[["apitest",0]]'
const historyURL = '/api/history/demo/demo?c=apitest'
const dsURL = '/api/ds/demo/demo?c=apitest'
const grantURL = '/api/grant/demo/demo'

describe("http", function() {

  describe("push", function() {

    var agent = request.agent(mlkccaEndpoint)

    it('push message', function (done) {
      agent
      .get(pushURL+'&v={"val":10}')
      //.set('Accept', 'application/json')
      .expect(function(res) {

        let result = JSON.parse(res.text)
        assert.equal(res.status, 200);
        assert.equal(result.err, null);

      }).end(function(err,res) {
        if(err){
            throw err;
        }
        done();
      });

    });

  })

  describe("history", function() {

    var agent = request.agent(mlkccaEndpoint)

    it('get history', function (done) {
      agent
      .get(historyURL)
      //.set('Accept', 'application/json')
      .expect(function(res) {

        let result = JSON.parse(res.text)
        assert.equal(res.status, 200);
        assert.equal(result.err, null);

      }).end(function(err,res) {
        if(err){
            throw err;
        }
        done();
      });

    });
    it('get history previous 1499682206324', function (done) {
      agent
      .get(historyURL + '&limit=5&ts=1499682206324')
      //.set('Accept', 'application/json')
      .expect(function(res) {

        let result = JSON.parse(res.text)
        assert.equal(result.content[0].t, 1499682205473);

      }).end(function(err,res) {
        if(err){
            throw err;
        }
        done();
      });

    });


  })

  describe("ds", function() {

    var agent = request.agent(mlkccaEndpoint)

    it('get apitest datastore', function (done) {
      agent
      .get(dsURL)
      .expect(function(res) {

        let result = JSON.parse(res.text)
        assert.equal(result.content[0], 'apitest');

      }).end(function(err,res) {
        if(err){
            throw err;
        }
        done();
      });

    });

  })

  describe("grant", function() {

    var agent = request.agent(mlkccaEndpoint)

    it('grant push API to apitest-grant', function (done) {
      agent
      .post(grantURL)
      .send({"rules":{"apitest-grant":["push"]},"ttl":3600})
      .expect(function(res) {

        let result = JSON.parse(res.text)
        assert.equal(result.content.rules['apitest-grant'][0], 'push');
        assert.equal(result.content.ttl, 3600);

      }).end(function(err,res) {
        if(err){
            throw err;
        }
        done();
      });

    });

  })


  describe("on", function() {

    this.timeout(10000)

    var agent = request.agent(mlkccaEndpoint)

    it('subscribe message', function (done) {
      agent
      .get(onPushURL)
      .expect(function(res) {

        let result = JSON.parse(res.text)
        let value = result.apitest[0][2]
        assert.equal(res.status, 200);
        assert.equal(value, '{"val":"Hello"}');

      }).end(function(err,res) {
        if(err){
            throw err;
        }
        done();
      });

      agent
      .get(pushURL+'&v={"val":"Hello"}')
      .expect(function(res) {

        let result = JSON.parse(res.text)
        assert.equal(res.status, 200);
        assert.equal(result.err, null);

      }).end(function(err,res) {
        if(err){
            throw err;
        }

      });


    });

  })


})
