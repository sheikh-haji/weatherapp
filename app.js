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
          var country=country_code[weatherData.sys.country];

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

           res.render("location2",{city:query,lat:lat,long:long,temperature:temper,description:des,image:imgpath,sunrise:sunrise,sunset:sunset,message:message,country:country});
        }
      );}
        });
    }

})
app.get("/",function(req,res){
  // console.log(typeof req);
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
    var country=country_code[weatherData.sys.country];
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

   res.render("data",{city:query,temperature:temper,description:des,image:imgpath,sunrise:sunrise,sunset:sunset,message:message,country:country});

  }
);}
  });
});
var country_code={
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BA": "Bosnia and Herzegovina",
    "BB": "Barbados",
    "WF": "Wallis and Futuna",
    "BL": "Saint Barthelemy",
    "BM": "Bermuda",
    "BN": "Brunei",
    "BO": "Bolivia",
    "BH": "Bahrain",
    "BI": "Burundi",
    "BJ": "Benin",
    "BT": "Bhutan",
    "JM": "Jamaica",
    "BV": "Bouvet Island",
    "BW": "Botswana",
    "WS": "Samoa",
    "BQ": "Bonaire, Saint Eustatius and Saba ",
    "BR": "Brazil",
    "BS": "Bahamas",
    "JE": "Jersey",
    "BY": "Belarus",
    "BZ": "Belize",
    "RU": "Russia",
    "RW": "Rwanda",
    "RS": "Serbia",
    "TL": "East Timor",
    "RE": "Reunion",
    "TM": "Turkmenistan",
    "TJ": "Tajikistan",
    "RO": "Romania",
    "TK": "Tokelau",
    "GW": "Guinea-Bissau",
    "GU": "Guam",
    "GT": "Guatemala",
    "GS": "South Georgia and the South Sandwich Islands",
    "GR": "Greece",
    "GQ": "Equatorial Guinea",
    "GP": "Guadeloupe",
    "JP": "Japan",
    "GY": "Guyana",
    "GG": "Guernsey",
    "GF": "French Guiana",
    "GE": "Georgia",
    "GD": "Grenada",
    "GB": "United Kingdom",
    "GA": "Gabon",
    "SV": "El Salvador",
    "GN": "Guinea",
    "GM": "Gambia",
    "GL": "Greenland",
    "GI": "Gibraltar",
    "GH": "Ghana",
    "OM": "Oman",
    "TN": "Tunisia",
    "JO": "Jordan",
    "HR": "Croatia",
    "HT": "Haiti",
    "HU": "Hungary",
    "HK": "Hong Kong",
    "HN": "Honduras",
    "HM": "Heard Island and McDonald Islands",
    "VE": "Venezuela",
    "PR": "Puerto Rico",
    "PS": "Palestinian Territory",
    "PW": "Palau",
    "PT": "Portugal",
    "SJ": "Svalbard and Jan Mayen",
    "PY": "Paraguay",
    "IQ": "Iraq",
    "PA": "Panama",
    "PF": "French Polynesia",
    "PG": "Papua New Guinea",
    "PE": "Peru",
    "PK": "Pakistan",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PM": "Saint Pierre and Miquelon",
    "ZM": "Zambia",
    "EH": "Western Sahara",
    "EE": "Estonia",
    "EG": "Egypt",
    "ZA": "South Africa",
    "EC": "Ecuador",
    "IT": "Italy",
    "VN": "Vietnam",
    "SB": "Solomon Islands",
    "ET": "Ethiopia",
    "SO": "Somalia",
    "ZW": "Zimbabwe",
    "SA": "Saudi Arabia",
    "ES": "Spain",
    "ER": "Eritrea",
    "ME": "Montenegro",
    "MD": "Moldova",
    "MG": "Madagascar",
    "MF": "Saint Martin",
    "MA": "Morocco",
    "MC": "Monaco",
    "UZ": "Uzbekistan",
    "MM": "Myanmar",
    "ML": "Mali",
    "MO": "Macao",
    "MN": "Mongolia",
    "MH": "Marshall Islands",
    "MK": "Macedonia",
    "MU": "Mauritius",
    "MT": "Malta",
    "MW": "Malawi",
    "MV": "Maldives",
    "MQ": "Martinique",
    "MP": "Northern Mariana Islands",
    "MS": "Montserrat",
    "MR": "Mauritania",
    "IM": "Isle of Man",
    "UG": "Uganda",
    "TZ": "Tanzania",
    "MY": "Malaysia",
    "MX": "Mexico",
    "IL": "Israel",
    "FR": "France",
    "IO": "British Indian Ocean Territory",
    "SH": "Saint Helena",
    "FI": "Finland",
    "FJ": "Fiji",
    "FK": "Falkland Islands",
    "FM": "Micronesia",
    "FO": "Faroe Islands",
    "NI": "Nicaragua",
    "NL": "Netherlands",
    "NO": "Norway",
    "NA": "Namibia",
    "VU": "Vanuatu",
    "NC": "New Caledonia",
    "NE": "Niger",
    "NF": "Norfolk Island",
    "NG": "Nigeria",
    "NZ": "New Zealand",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "CK": "Cook Islands",
    "XK": "Kosovo",
    "CI": "Ivory Coast",
    "CH": "Switzerland",
    "CO": "Colombia",
    "CN": "China",
    "CM": "Cameroon",
    "CL": "Chile",
    "CC": "Cocos Islands",
    "CA": "Canada",
    "CG": "Republic of the Congo",
    "CF": "Central African Republic",
    "CD": "Democratic Republic of the Congo",
    "CZ": "Czech Republic",
    "CY": "Cyprus",
    "CX": "Christmas Island",
    "CR": "Costa Rica",
    "CW": "Curacao",
    "CV": "Cape Verde",
    "CU": "Cuba",
    "SZ": "Swaziland",
    "SY": "Syria",
    "SX": "Sint Maarten",
    "KG": "Kyrgyzstan",
    "KE": "Kenya",
    "SS": "South Sudan",
    "SR": "Suriname",
    "KI": "Kiribati",
    "KH": "Cambodia",
    "KN": "Saint Kitts and Nevis",
    "KM": "Comoros",
    "ST": "Sao Tome and Principe",
    "SK": "Slovakia",
    "KR": "South Korea",
    "SI": "Slovenia",
    "KP": "North Korea",
    "KW": "Kuwait",
    "SN": "Senegal",
    "SM": "San Marino",
    "SL": "Sierra Leone",
    "SC": "Seychelles",
    "KZ": "Kazakhstan",
    "KY": "Cayman Islands",
    "SG": "Singapore",
    "SE": "Sweden",
    "SD": "Sudan",
    "DO": "Dominican Republic",
    "DM": "Dominica",
    "DJ": "Djibouti",
    "DK": "Denmark",
    "VG": "British Virgin Islands",
    "DE": "Germany",
    "YE": "Yemen",
    "DZ": "Algeria",
    "US": "USA",
    "UY": "Uruguay",
    "YT": "Mayotte",
    "UM": "United States Minor Outlying Islands",
    "LB": "Lebanon",
    "LC": "Saint Lucia",
    "LA": "Laos",
    "TV": "Tuvalu",
    "TW": "Taiwan",
    "TT": "Trinidad and Tobago",
    "TR": "Turkey",
    "LK": "Sri Lanka",
    "LI": "Liechtenstein",
    "LV": "Latvia",
    "TO": "Tonga",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LR": "Liberia",
    "LS": "Lesotho",
    "TH": "Thailand",
    "TF": "French Southern Territories",
    "TG": "Togo",
    "TD": "Chad",
    "TC": "Turks and Caicos Islands",
    "LY": "Libya",
    "VA": "Vatican",
    "VC": "Saint Vincent and the Grenadines",
    "AE": "United Arab Emirates",
    "AD": "Andorra",
    "AG": "Antigua and Barbuda",
    "AF": "Afghanistan",
    "AI": "Anguilla",
    "VI": "U.S. Virgin Islands",
    "IS": "Iceland",
    "IR": "Iran",
    "AM": "Armenia",
    "AL": "Albania",
    "AO": "Angola",
    "AQ": "Antarctica",
    "AS": "American Samoa",
    "AR": "Argentina",
    "AU": "Australia",
    "AT": "Austria",
    "AW": "Aruba",
    "IN": "India",
    "AX": "Aland Islands",
    "AZ": "Azerbaijan",
    "IE": "Ireland",
    "ID": "Indonesia",
    "UA": "Ukraine",
    "QA": "Qatar",
    "MZ": "Mozambique"
  };

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
