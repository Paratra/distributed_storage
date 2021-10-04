const IPFS = require('ipfs');
const fs = require('fs');
const OrbitDB = require('orbit-db');
const express = require('express'); // npm install express --save
const fileUpload = require('express-fileupload'); // Docs - https://www.npmjs.com/package/express-fileupload

const app = express();
const port = 3001;
app.use(fileUpload());
const ipfsOptions = { repo : './files', }
var db;
var files;

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname })
});

app.post('/upload', upload)

app.get('/index.js', function(req, res) {
  res.sendFile(__dirname + "/" + "index.js");
});

app.get('/styles.css', function(req, res) {
  res.sendFile(__dirname + "/" + "styles.css");
});

app.get('/getFiles', getFiles)

app.get('/getFile', getFile)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

async function main(req, res) {
  const ipfs = await IPFS.create(ipfsOptions)
  const orbitdb = await OrbitDB.createInstance(ipfs);
  db = await orbitdb.keyvalue('first-database')
  await db.load();

  files = db.index
}
main();

async function getFile(req, res) {
  var index = req.query.index;
  var fileName = Object.keys(files)[index];

  console.log(req.query.index)

  fileBuffer = await db.get(fileName)

  fs.writeFile('./temp/' + fileName, fileBuffer, () => {
    res.download('./temp/' + fileName, fileName)
  })

  // fs.writeFile('/temp/' + Object.keys(files)[index], fileBuffer, function() {res.download('/temp/' + Object.keys(files)[index])});
}

async function getFiles(req, res) {
  res.send(Object.keys(files));
}

async function upload(req, res) {
  // Create ipfs and orbitdb

  // Get uploaded file
  var fileInfo = req.files.uploadedFile;
  var file = await Buffer.from(fileInfo.data);

  // Add to orbitdb
  await db.put(fileInfo.name, file);

  console.log(db.get(fileInfo.name));

  // Loop all files
  // const all = db.query()

  // const result = db.iterator({ limit: -1 }).collect();
  console.log(db.index);

  res.redirect('back');
}

// async function main () {
//   // Create IPFS instance
//   const ipfsOptions = { repo : './a', }
//   const ipfs = await IPFS.create(ipfsOptions)

//   // Create OrbitDB instance
//   const orbitdb = await OrbitDB.createInstance(ipfs)

//   // Create database instance
//   const db = await orbitdb.keyvalue('first-database')
//   await db.load();

//   // Add file to OrbitDB

//   // var file = {
//   //           path: './testFile.txt'
//   // }

//   const file = {
//     path: './uploadedFile.jpeg',
//     content: fs.readFileSync('./testPicture.jpeg')
//   }

//   hash = await ipfs.add(file)
//   console.log(hash)

//   hash = await db.put('name', file);

//   // console.log(hash)
//   // const event = db.get(hash)
//   // console.log(event)
//   const value = db.get('name');
//   console.log(value['content']);

//   let buf = Buffer.from(value['content'])
//   console.log(buf);

//   fs.writeFile('./recievedImage.jpeg', buf, () => {console.log("downloaded")})


//   }

// main()