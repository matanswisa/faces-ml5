require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const { FaceModel } = require("./models/face.js");
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const { RecognizedPeople } = require("./models/recognizedPeople.js");
const detectedPeople = [];

//multer options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'images'))
  },
  filename: (req, file, cb) => {
    console.log(`saveReq: ${file.filename}`)
    cb(null, file.originalname);
  }
})

app.use(bodyParser.urlencoded({
  extended: true
}));

const uploads = multer({
  storage: storage
});

app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost/recognized_faces')
  .then(() => {
    console.log('DB Connection eastablished');
  }).catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use(helmet());

// used to log requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  express.json({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post('/user-data', (req, res) => {
  console.log(`Request Body: \n\r
  ================================================================\n\r
  {req.body["FormData"]}`);
  res.send(JSON.stringify(req.FormData));
  // res.status();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

app.post('/detectPeople',  async (req, res) => {
  const { name, id } = req.body;
  // find person by id
  // const person = detectedPeople.find((person) => person.id === id);
  // if (!person) {
  //   detectedPeople.push(person);
  // } else if(person){
  //   detectedPeople.
  // }
  
  const result = await RecognizedPeople.create({id , name , imagePath:"hardcoded path"});
  res.status(200).json(result);
});


// upload images route
app.post('/upload', uploads.single("img"), (req, res) => {
  //console.log(uploads.single)
  req.file.filename = req.body.name;
  // console.log(req.file.filename);
  // console.log(req.file.path);
  // console.log(req.body.name);
  res.status(200).sendFile(req.file.path);
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
});

/* 
app.post("/upload", uploads.array("img"), uploadFiles);

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.img);
}
 */
app.get('/getFaces', async (req, res) => {
  const faces = await FaceModel.find({});
  if (!faces.length) return res.status(400).send({ success: false });
  res.status(200).json(faces);
})


app.post('/uploadFace', async (req, res) => {
  const { id } = req.body

  // await writeToJsonFile(jsonObj, path.join(__dirname, '../data/people.json'));
  const recognizedPerson = await FaceModel.findOne({ id });
  if (!recognizedPerson) {
    await FaceModel.create(req.body);
    res.status(200).send({ sucess: true });
  } else {
    res.status(400).send({ success: false });
  }
})


app.listen(PORT, () =>
  console.log("Server is running at http://127.0.0.1:" + PORT)
);
