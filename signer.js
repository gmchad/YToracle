let express = require('express')
let bodyParser = require('body-parser')
let { getSigHash } = require('coins')
let { sign } = require('secp256k1')
let fs = require('fs')
let { post } = require('axios')

let privkeyHex = fs.readFileSync('./privkey')
let privkey = Buffer.from(privkeyHex.toString(), 'hex')

let app = express()
app.use(bodyParser.json())
app.post('/', signTx)
app.listen(3001)

function signTx (req, res) {
  let tx = req.body
  let sigHash = getSigHash(tx)
  tx.from[0].signature = sign(sigHash, privkey).signature
  console.log(tx)
  post('http://localhost:3000/txs', tx)
    .then((res) => console.log(res.data.result))
  res.end()
}
