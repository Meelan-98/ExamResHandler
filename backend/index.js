var express = require('express');
const dotenv = require('dotenv');

var apiController = require("./RouteFacade/APIController");
var authController = require("./RouteFacade/authController");

var {RestoreSession} = require("./Services/authServices");

var app = express();
dotenv.config();

RestoreSession();

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "DELETE,PUT");
    next();
});

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "nul");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });


app.use('/api',apiController);
app.use('/auth',authController);

console.log("Backend Started Listening!!")
app.listen(process.env.PORT || 5000);


