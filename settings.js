module.exports = {
  development: {
    endpoint: 'http://localhost:8000',
    mqttEndpoint: 'localhost',
    websocketEndpoint: 'localhost:8000',
    appId: process.env.APP_ID,
    apiKey: process.env.API_KEY
  },
  staging: {
    endpoint: 'https://stg-pubsub1.mlkcca.com',
    mqttEndpoint: 'stg-pubsub1.mlkcca.com',
    websocketEndpoint: 'stg-pubsub1.mlkcca.com',
    appId: process.env.APP_ID,
    apiKey: process.env.API_KEY
  },
  production: {
    endpoint: 'https://pubsub1.mlkcca.com',
    mqttEndpoint: 'pubsub1.mlkcca.com',
    websocketEndpoint: 'pubsub1.mlkcca.com',
    appId: 'demo',
    apiKey: 'demo'
  },
  test: {
    endpoint: 'https://pubsub1.mlkcca.com',
    mqttEndpoint: 'pubsub1.mlkcca.com',
    websocketEndpoint: 'pubsub1.mlkcca.com',
    appId: 'demo',
    apiKey: 'demo'
  }
}
