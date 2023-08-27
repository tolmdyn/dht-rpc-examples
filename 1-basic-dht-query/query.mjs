#!/usr/bin/env node

import DHT from 'dht-rpc'
import crypto from 'crypto'

const GET = 1

const hex = process.argv[2]

const node = new DHT({ ephemeral: true, bootstrap: ['127.0.0.1:10001'] })
await node.ready()

console.log('Node initalised at:', node.port, node.host);
const q = node.query({ target: Buffer.from(hex, 'hex'), command: GET }, { commit: true })

// console.log(`hex: ${hex.toString()}`);

try {
  for await (const data of q) {
    if (data.value && hash(data.value).toString('hex') === hex) {
      // We found the value! Destroy the query stream as there is no need to continue.
      console.log('Item found.\n', hex, '-->', data.value.toString())
      break
    }
}
} catch (e) {
  if (e.message === 'Too few nodes responded'){
    console.log('Too few nodes responded, item not found in DHT.');
  } else {
    throw e;
  }
}

console.log('(query finished)')
node.destroy(); // cleanup, allow script to complete

function hash(val) {
    return crypto.createHash('sha256').update(val).digest()
  }