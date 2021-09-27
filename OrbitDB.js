const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
fs = require('fs');

async function main () {
  // Create IPFS instance
  const ipfsOptions = { repo : './OrbitDBDatabase', }
  const ipfs = await IPFS.create(ipfsOptions)

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs)

  // Create database instance
  const db = await orbitdb.keyvalue('first-database')
  await db.load();

  // Add file to OrbitDB

  // var file = {
  //           path: './testFile.txt'
  // }

  const file = {
    path: './uploadedFile.jpeg',
    content: fs.readFileSync('./testPicture.jpeg')
  }

  hash = await ipfs.add(file)
  console.log(hash)

  hash = await db.put('name', file);

  // console.log(hash)
  // const event = db.get(hash)
  // console.log(event)
  const value = db.get('name');
  console.log(value['content']);

  let buf = Buffer.from(value['content'])
  console.log(buf);

  fs.writeFile('./recievedImage.jpeg', buf, () => {console.log("downloaded")})


  }

main()