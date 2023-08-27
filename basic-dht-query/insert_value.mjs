import DHT from 'dht-rpc'
import crypto from 'crypto'
import { log } from 'console'

const INSERT = 0

const node = new DHT({ ephemeral: true, bootstrap: ['127.0.0.1:10001'] })
const val = Buffer.from(process.argv[2])

const hex = 'a7ba3bf0fdc79ddeba23a3bd4a323238e1823c6f4103288f19501737dfd874c7'; //this used to be the hash of the value, but we want custom hashes


const q = node.query({
  target: Buffer.from(hex, 'hex'),
  command: INSERT,
  value: val
}, {
  // commit true will make the query re-request the 20 closest
  // nodes with a valid round trip token to update the values
  commit
})

await q.finished()
console.log('Inserted', hash(val).toString('hex'))

async function commit(reply) {
    await node.request({token: reply.token, target: hash(val), command: INSERT, value: val}, reply.from)
    //console.log('committed v ', reply);
}

function hash(value) {
    return crypto.createHash('sha256').update(value).digest()
  }