# dht-rpc examples

## Basic DHT Query



### To set up the network: 

- <b>./bootstrap.mjs</b> : creates a bootstrap node for the network
- <b>./createnodes.mjs</b> : creates 100 nodes using the bootstrap and defines rpc methods
- <b>./insert.mjs</b> \<item> : inserts an item into the network
- <b>./query.mjs</b> \<item key> : queries the network for an item