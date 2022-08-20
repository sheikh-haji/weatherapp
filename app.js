const express=require("express");
const mongoose=require("mongoose");
const https=require("https");
const bodyparser=require("body-parser");
const _=require("lodash");
var geolocation = require('geolocation')
// const ejs=require("ejs")
app=express();
// app.listen(3000,function(){console.log("yes i am listenning at 3000")});

app.listen(process.env.PORT || 3000, function(){
console.log("Server is running in port 3000")
});

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
// database
mongoose.connect("mongodb+srv://sheikhhaji18:18shakila@cluster0.2akiep0.mongodb.net/CityDB?retryWrites=true&w=majority",{useNewUrlParser:true});
const fruitSchema=new mongoose.Schema({name: { type: String  }});
const City=new mongoose.model("cities",fruitSchema);
app.get("/current",function(req,res){
  res.render("location");
})
app.post("/current",function(req,res){
  var long=req.body.long;
    var lat=req.body.lat;
    if(long==="0" && long==="0"){
      res.render("location1");
    }
    else{

        const apikey="bcc8854a89200f1c4978826c42cbe10e";
        const units="metric";
        const url="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid="+apikey+"&units="+units;
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

          query=weatherData.name
          const part=weatherData.weather[0].icon;
          var sunrise=convertTime(weatherData.sys.sunrise,weatherData.timezone);

          var sunset=convertTime(weatherData.sys.sunset,weatherData.timezone);


          // console.log("pressure of"+query+" "+weatherData.main.pressure);
          // https://openweathermap.org/img/wn/03d@2x.png
          console.log(weatherData.weather[0].id);
           var imgpath="https://openweathermap.org/img/wn/";
           imgpath=imgpath+part;
           imgpath=imgpath+"@2x.png";
           console.log(imgpath);
           var message=getMessage(temper);

        //   res.write("<h1>the temperature in "+query+" is "+temper+" `C</h1>");
        //   res.write("<h2>The weather is "+des+"</h2>");
        //   res.write("<img src=\""+imgpath+"\">");
        //   res.send();

           res.render("location2",{city:query,temperature:temper,description:des,image:imgpath,sunrise:sunrise,sunset:sunset,message:message});
        }
      );}
        });
    }

})
app.get("/",function(req,res){
  var lists=[];
  City.find(function(err,fruits){
     if(err){
       console.log(err);
        res.render("index",{list:lists});
     }
     else{
        for(var i=0;i<fruits.length;i++){
          var i1=fruits[i];
          // console.log(i1.name);
          lists.push(i1.name);
        }
        console.log(lists);
       res.render("index",{list:lists});
     }

});

});
function convertTime(unixTime, offset){
    let date = new Date((unixTime+offset) * 1000);
    var hours = date.getUTCHours();
 var minutes = date.getUTCMinutes();
 var ampm = hours >= 12 ? 'PM' : 'AM';
 hours = hours % 12;
 hours = hours ? hours : 12; // the hour '0' should be '12'
 minutes = minutes < 10 ? '0'+minutes : minutes;
 var strTime = hours + ':' + minutes + ' ' + ampm;
 return strTime;
}
function getMessage(temp) {
   if (temp > 25) {
     return 'It\'s🍦time';
   } else if (temp > 20) {
     return 'It\'s👕,🩳time';
   } else if (temp < 10) {
     return 'It\'s🧣🧤time';
   } else {
     return 'It\'s🧥time';
   }
 }
app.post("/",function(req,res){
  var query=_.capitalize(req.body.cityholder);

  const apikey="bcc8854a89200f1c4978826c42cbe10e";
  const units="metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+units;
  https.get(url,function(response){
  console.log(response.statusCode);
  if(response.statusCode!==200){
    res.render("location1");
  }
  else{
  response.on("data",function(data){
    // console.log(data);
    const weatherData=JSON.parse(data);
    const temper=weatherData.main.temp;
    const des=_.capitalize(weatherData.weather[0].main);

    query=weatherData.name
    const part=weatherData.weather[0].icon;
    var sunrise=convertTime(weatherData.sys.sunrise,weatherData.timezone);

    var sunset=convertTime(weatherData.sys.sunset,weatherData.timezone);

    // console.log("pressure of"+query+" "+weatherData.main.pressure);
    // https://openweathermap.org/img/wn/03d@2x.png
    console.log(weatherData.weather[0].id);
     var imgpath="https://openweathermap.org/img/wn/";
     imgpath=imgpath+part;
     imgpath=imgpath+"@2x.png";
     console.log(imgpath);
     var message=getMessage(temper);

  //   res.write("<h1>the temperature in "+query+" is "+temper+" `C</h1>");
  //   res.write("<h2>The weather is "+des+"</h2>");
  //   res.write("<img src=\""+imgpath+"\">");
  //   res.send();

   res.render("data",{city:query,temperature:temper,description:des,image:imgpath,sunrise:sunrise,sunset:sunset,message:message});

  }
);}
  });
});

// app.get("/",function(req,res){
//     res.render("list",{item1:"",item2:"",item3:""})
//
// });
// app.get("/y",function(req,res){
//   res.render("data");
// });
// https://api.openweathermap.org/data/2.5/weather?q="chennai"&appid="bcc8854a89200f1c4978826c42cbe10e"
// app.post("/",function(req,res){
//   var query=_.capitalize(req.body.cityholder);
//
//   const apikey="bcc8854a89200f1c4978826c42cbe10e";
//   const units="metric";
//   const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+units;
//   https.get(url,function(response){
//   console.log(response.statusCode);
//   if(response.statusCode!==200){
//     res.render("failure");
//   }
//   else{
//   response.on("data",function(data){
//     // console.log(data);
//     const weatherData=JSON.parse(data);
//     const temper=weatherData.main.temp;
//     const des=_.capitalize(weatherData.weather[0].main);
//
//     query=weatherData.name
//     const part=weatherData.weather[0].icon;
//     // console.log("pressure of"+query+" "+weatherData.main.pressure);
//     // https://openweathermap.org/img/wn/03d@2x.png
//     console.log(weatherData.weather[0].id);
//      var imgpath="https://openweathermap.org/img/wn/";
//      imgpath=imgpath+part;
//      imgpath=imgpath+"@2x.png";
//      console.log(imgpath);
//
//   //   res.write("<h1>the temperature in "+query+" is "+temper+" `C</h1>");
//   //   res.write("<h2>The weather is "+des+"</h2>");
//   //   res.write("<img src=\""+imgpath+"\">");
//   //   res.send();
//
//      res.render("success",{city:query,temperature:temper,description:des,image:imgpath});
//   }
// );}
//   });
// })
// app.post("/failure",function(req,res){
//   res.redirect("/");
// });
//
// // const query="avadi,chennai,tamilnadu";
// // const apikey="bcc8854a89200f1c4978826c42cbe10e";
// // const units="metric";
// // const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+units;
// // https.get(url,function(response){
// // console.log(response.statusCode);
// // response.on("data",function(data){
// //   // console.log(data);
// //   const weatherData=JSON.parse(data);
// //   temper=weatherData.main.temp;
// //   des=weatherData.weather[0].main;
// //   console.log(weatherData.name);
// //   const part=weatherData.weather[0].icon;
// //   var imgpath="https://openweathermap.org/img/wn/";
// //   imgpath=imgpath+part;
// //   imgpath=imgpath+"@2x.png";
// //   console.log(imgpath);
// //   // const temp2={name:"sheikh ameenul haji",
// //   //              address:"avadi,chennai"};
// //   //              console.log(JSON.stringify(temp2));
// //   res.write("<h1>the temperature in Avadi,Chennai is "+temper+" `C</h1>");
// //   res.write("<h2>The weather is "+des+"</h2>");
// //   res.write("<img src=\""+imgpath+"\">");
// //   res.send();
// // });
// // });
