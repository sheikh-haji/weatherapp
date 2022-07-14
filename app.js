const express=require("express");
const https=require("https");
const bodyparser=require("body-parser");
const _=require("lodash");
// const ejs=require("ejs")
app=express();
// app.listen(3000,function(){console.log("yes i am listenning at 3000")});
app.listen(process.env.PORT || 3000, function(){
console.log("Server is running in port 3000")
});

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
app.get("/",function(req,res){
    res.render("list",{item1:"",item2:"",item3:""})

});
app.post("/",function(req,res){
  const query=_.capitalize(req.body.cityholder);

  const apikey="bcc8854a89200f1c4978826c42cbe10e";
  const units="metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+units;
  https.get(url,function(response){
  console.log(response.statusCode);
  if(response.statusCode!==200){
    res.render("failure");
  }
  else{
  response.on("data",function(data){
    // console.log(data);
    const weatherData=JSON.parse(data);
    const temper=weatherData.main.temp;
    const des=_.capitalize(weatherData.weather[0].main);

    console.log(weatherData.name);
    const part=weatherData.weather[0].icon;
    var imgpath="https://openweathermap.org/img/wn/";
    imgpath=imgpath+part;
    imgpath=imgpath+"@2x.png";
    console.log(imgpath);

    // res.write("<h1>the temperature in "+query+" is "+temper+" `C</h1>");
    // res.write("<h2>The weather is "+des+"</h2>");
    // res.write("<img src=\""+imgpath+"\">");
    // res.send();

    res.render("success",{city:query,temperature:temper,description:des,image:imgpath});
  }
);}
  });
})
app.post("/failure",function(req,res){
  res.redirect("/");
});

// const query="avadi,chennai,tamilnadu";
// const apikey="bcc8854a89200f1c4978826c42cbe10e";
// const units="metric";
// const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+units;
// https.get(url,function(response){
// console.log(response.statusCode);
// response.on("data",function(data){
//   // console.log(data);
//   const weatherData=JSON.parse(data);
//   temper=weatherData.main.temp;
//   des=weatherData.weather[0].main;
//   console.log(weatherData.name);
//   const part=weatherData.weather[0].icon;
//   var imgpath="https://openweathermap.org/img/wn/";
//   imgpath=imgpath+part;
//   imgpath=imgpath+"@2x.png";
//   console.log(imgpath);
//   // const temp2={name:"sheikh ameenul haji",
//   //              address:"avadi,chennai"};
//   //              console.log(JSON.stringify(temp2));
//   res.write("<h1>the temperature in Avadi,Chennai is "+temper+" `C</h1>");
//   res.write("<h2>The weather is "+des+"</h2>");
//   res.write("<img src=\""+imgpath+"\">");
//   res.send();
// });
// });
