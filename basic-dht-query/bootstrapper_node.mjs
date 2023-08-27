import DHT from 'dht-rpc'
//const DHT = require('dht-rpc')

const bootstrap = DHT.bootstrapper(10001, '127.0.0.1');
await bootstrap.ready()
console.log(bootstrap.address())
