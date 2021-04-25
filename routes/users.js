var express = require('express');
var router = express.Router();
const cors = require('cors');
var CryptoJS = require('crypto-js');

router.use(cors());



/* GET users listing. */

router.post("/newaccount", function(req, res){

  let userPass = req.body.userPw;
  let secretPass = CryptoJS.AES.encrypt(userPass, "Gum1p7tdjtPggxs3gfdZ1izzGCkfE7HK").toString();
  // let secretPass = CryptoJS.AES.encrypt(userPass, process.env.SECRET_KEY).toString();
  console.log("secretPass", secretPass);
  let originalPass = CryptoJS.AES.decrypt(secretPass, "Gum1p7tdjtPggxs3gfdZ1izzGCkfE7HK");
  // let originalPass = CryptoJS.AES.decrypt(secretPass, process.env.SECRET_KEY);
  originalPass = originalPass.toString(CryptoJS.enc.Utf8);

  req.app.locals.db.collection("prenumeranter").insertOne({"userName": req.body.userName, "userEmail": req.body.userEmail, "userPw": secretPass, "newsletter": req.body.newsletter})
  .then(result => {
  let answer = {"id": result.insertedId, "userName": req.body.userName, "newsletter": req.body.newsletter};

  res.json(answer);
})
})

router.post("/update", function(req, res){

  req.app.locals.db.collection("prenumeranter").updateOne({"userName": req.body.userName}, {$set: {"newsletter": req.body.newsletter}})
  .then(result => {
    // console.log(result);
  })
  let answer = {"id": req.body._id, "userName": req.body.userName, "newsletter": req.body.newsletter};

  res.json(answer);
})


router.post("/login", function(req, res){
  let userPass = req.body.userPw;
  let secretPass = CryptoJS.AES.encrypt(userPass, "Gum1p7tdjtPggxs3gfdZ1izzGCkfE7HK").toString();
  // let secretPass = CryptoJS.AES.encrypt(userPass, process.env.SECRET_KEY).toString();
  let originalPass = CryptoJS.AES.decrypt(secretPass, "Gum1p7tdjtPggxs3gfdZ1izzGCkfE7HK");
  // let originalPass = CryptoJS.AES.decrypt(secretPass, process.env.SECRET_KEY);
  originalPass = originalPass.toString(CryptoJS.enc.Utf8);

  


  req.app.locals.db.collection("prenumeranter").find({"userName": req.body.userName}).toArray()
  

  .then(result => {
    let loginTestPass = result[0].userPw;
    let loginTestPassOriginal = CryptoJS.AES.decrypt(loginTestPass, "Gum1p7tdjtPggxs3gfdZ1izzGCkfE7HK");
    loginTestPassOriginal = loginTestPassOriginal.toString(CryptoJS.enc.Utf8);

    let answer;

    if (result[0].userName === req.body.userName && loginTestPassOriginal === userPass) {
      answer = {"id": result[0]._id, "userName": result[0].userName, "newsletter": result[0].newsletter}
    } else {
      answer = "error"
    }

    res.json(answer);
  })
})


module.exports = router;
