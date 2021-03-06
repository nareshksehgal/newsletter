const request = require("request");
const express = require("express");
const https =  require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
const firstName = req.body.firstName;
const lastName = req.body.lastName;
const inputEmail = req.body.inputEmail;
//console.log(firstName, lastName, inputEmail);
  var data = {
    members: [
      {
        email_address: inputEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const url = 'https://us18.api.mailchimp.com/3.0/lists/65fb6018cb';
  var jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: "nareshksehgal:<mykeyID>"
  }

  const request = https.request(url, options, function(response){
  if (response.statusCode === 200){
//    res.send("Successfully subscribed, thanks "+ firstName);
      res.sendFile(__dirname+ "/success.html");
  }  else {
//    res.send("Sorry "+ firstName + ", please try again.");
      res.sendFile(__dirname+ "/failure.html");
  }

 response.on("data", function(data){
    console.log(JSON.parse(data));
  });

});

request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

//change port for Heroku
//app.listen(3000, function(){
app.listen(process.env.PORT||3000, function(){
  console.log("My newsletter server is running on port 3000.");
});

//API key
//Audience ID
// 65fb6018cb
