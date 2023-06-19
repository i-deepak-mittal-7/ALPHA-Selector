const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const path=require("path");

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var success=0;
var infoList = [];
var alert;
var post;


app.get("/student",function(req,res){
  res.render("student.ejs");
});

app.post("/student",function(req,res){
  post=req.body.post;
  res.render("applyform.ejs",{post:post});
});

app.post("/applyForm",function(req,res){
  const firstName=req.body.firstName;
  const lastName=req.body.lastName;
  const email=req.body.email;
  const password=req.body.password;
  const skills=req.body.skills;
  const resumeLink=req.body.resumeLink;
  if(infoList.length>0) 
  {
    let obj = infoList.find(applicant=> applicant.email === email);
    if(obj)
    {
      alert="You have already applied. You cannot apply again";
      res.render("alert.ejs",{alert:alert});
    }
    else 
    {
      var info = 
      {
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password,
        post:post,
        skills:skills,
        resumeLink:resumeLink,
        applicationStatus:"Pending"
      };
      infoList.push(info);
      alert="Succesfully applied! Check your application status soon.";
      res.render("alert.ejs",{alert:alert});
    }
  }
  else 
  {
    var info = {
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password,
      post:post,
      skills:skills,
      resumeLink:resumeLink,
      applicationStatus:"Pending"
    };
    infoList.push(info);
    alert="Succesfully applied! Check your application status soon.";
    res.render("alert.ejs",{alert:alert});
  }
});

app.get("/admin",function(req,res){
  if(success===0){
    res.render("signIn.ejs")
  }
  else {
    success=0;
    res.render("admin.ejs",{infoList:infoList});
  }
});

app.post("/admin",function(req,res){
  var email=[];
  email.push(req.body.applicationStatus);
  console.log(email);
  for(var i=0; i<infoList.length; i++){
    if(infoList[i].applicationStatus==="Pending"){
      infoList[i].applicationStatus="Rejected";
    }
  }
  if(email){
    for(var i=0; i<email.length; i++){
      let obj = infoList.find(applicant=> applicant.email === email[i]);
      if(obj){
        obj.applicationStatus="Approved";
      }
    }
  }
  alert="Shortlist report sent.";
  res.render("alert.ejs",{alert:alert});
  
});

app.post("/signIn",function(req,res){
  if(req.body.username==="Batman" && req.body.password==="password"){
    success=1;
    res.redirect("/admin");
  }
});

app.get("/appStatus",function(req,res){
  let obj;
  res.render("appStatus.ejs",{obj:obj});
});

app.post("/appStatus",function(req,res){
  const email=req.body.email;
  const password=req.body.password;
  let obj = infoList.find(applicant=> applicant.email === email && applicant.password===password);
  if(obj){
    res.render("appStatus.ejs",{obj:obj});
  }
  else {
    alert="Wrong Username or Password";
    res.render("alert.ejs",{alert:alert});
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
