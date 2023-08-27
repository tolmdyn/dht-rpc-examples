import DHT from 'dht-rpc'
import crypto from 'crypto'

const GET = 1

const hex = process.argv[2]
//const hex = sha256(process.argv[2])
// const hex = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
const node = new DHT({ ephemeral: true, bootstrap: ['127.0.0.1:10001'] })
await node.ready()

console.log(node.port, node.host);
const q = node.query({ target: Buffer.from(hex, 'hex'), command: GET }, { commit: true })

console.log(`hex: ${hex.toString()}`);

for await (const data of q) {
  console.log("Test");
  if (data.value && sha256(data.value).toString('hex') === hex) {
    // We found the value! Destroy the query stream as there is no need to continue.
    console.log(hex, '-->', data.value.toString())
    break
  }
}

console.log('(query finished)')

function sha256 (val) {
    return crypto.createHash('sha256').update(val).digest()
  }