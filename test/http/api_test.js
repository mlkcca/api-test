var request = require('supertest');
var assert = require('assert');

const mlkccaEndpoint = 'https://pubsub1.mlkcca.com'
const pushURL = '/api/push/demo/demo?c=apitest'
const onPushURL = '/on/push/demo/demo?c=[["apitest",0]]'
const historyURL = '/api/history/demo/demo?c=apitest'

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
    it('get history previous 1499680910228', function (done) {
      agent
      .get(historyURL + '&limit=5&ts=1499680910228')
      //.set('Accept', 'application/json')
      .expect(function(res) {

        let result = JSON.parse(res.text)
        assert.equal(result.content[0].t, 1499680909693);

      }).end(function(err,res) {
        if(err){
            throw err;
        }
        done();
      });

    });


  })

  describe("on", function() {

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
