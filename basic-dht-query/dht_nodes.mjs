import DHT from 'dht-rpc'
import crypto from 'crypto'

// Let's create 100 dht nodes for our example.
const swarm = []
for (let i = 0; i < 100; i++) swarm[i] = createNode()

function createNode() {
  const node = new DHT({
    ephemeral: false,
    bootstrap: [
      '127.0.0.1:10001'
    ]
  })

  const values = new Map()
  const INSERT = 0 // define a command enum
  const GET = 1


  node.on('request', function (req) {
    // console.log ('request', req);
    if (req.command === INSERT) {
      if (req.token) { // if we are the closest node store the value (ie the node sent a valid roundtrip token)
        // const key = hash(req.value).toString('hex')
        const key = req.target.toString('hex');
        values.set(key, req.value)
        console.log('Storing', key, '-->', req.value.toString())
        return req.reply(null)
      }

      const value = values.get(req.target.toString('hex'))
      req.reply(value)
    }
    if (req.command === GET) {
      console.log('GET');
      
      // convert buffer to hex string
      const target = req.target.toString('hex')
      console.log('request for', target, 'at', node.id)
      console.log('values:', values.get(target));
      if (values.has(target)){
        console.log('Found', target);
        return req.reply(values.get(target))
      }
      //console.log('', values.get(req.target));
    }
  })
  return node
}


function hash(value) {
  return crypto.createHash('sha256').update(value).digest()
}
