var express = require('express');
var router = express.Router();
const cors = require('cors');

router.use(cors());

let htmlHead = `<title>Nyhetsbrev</title><link rel="stylesheet" href="/stylesheets/style.css">`

/* GET users listing. */
router.get('/', function(req, res) {
  let loginForm = `<title>Adminsida Nyhetsbrev</title>
                  <link href="/stylesheets/style.css" type="text/css" rel="stylesheet" />
                  <div><h2>Logga in</h2>
                  <form action="/admin" method="post">
                  Ange lösenord: </br>
                  <div><input type="text" name="userPwAdmin"> </div>
                  <div><button type="submit">Logga in</button></div></form></div>
                  `
                  
                  res.send(loginForm);
})

router.post('/', function(req, res) {
  let errorMsg = htmlHead + `<div>Fel lösenord</div>`

  if (req.body.userPwAdmin == "admin") {
    console.log("ok!")
    req.app.locals.db.collection("prenumeranter").find().toArray()
    .then(results => {
      console.log(results);
  
      let printUsers = htmlHead + "<div><h2>Alla användare</h2>"
      for (user in results) {
        printUsers += "<div>" + results[user].userName + " - " + results[user].userEmail + " - " + results[user]._id + "</div>"
      }

      printUsers += "<h2>Prenumeranter Nyhetsbrev:</h2>"
      for (user in results) {
        if (results[user].newsletter == true){
        printUsers += "<div>" + results[user].userEmail + "</div>"
        } 
      }
      printUsers += "</div>"

      res.send(printUsers);
    })
    } else {
      console.log("nepp!")
      res.send(errorMsg);
  }
})




module.exports = router;
