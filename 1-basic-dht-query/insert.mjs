#!/usr/bin/env node

import DHT from 'dht-rpc'
import crypto from 'crypto'

const INSERT = 0

const node = new DHT({ ephemeral: true, bootstrap: ['127.0.0.1:10001'] })
const val = Buffer.from(process.argv[2])

const q = node.query({
  target: hash(val),
  command: INSERT,
  value: val
}, {
  // commit true will make the query re-request the 20 closest
  // nodes with a valid round trip token to update the values - where is this comment from?
  commit
})

await q.finished()
console.log('Inserted', hash(val).toString('hex'), 'value ', val.toString());
node.destroy();

async function commit(reply) {
    await node.request({token: reply.token, target: hash(val), command: INSERT, value: val}, reply.from)
    //console.log('committed v ', reply);
}

function hash(value) {
    return crypto.createHash('sha256').update(value).digest()  // returns a buffer
  }