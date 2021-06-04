var express = require('express');
var router = express.Router();

const {ResponseHandler} = require("../Controller/ResponseController");

const Method = require("../Controller/method");
const {UController} = require("../Controller/UserController")
const {ExtractUser} = require("../Services/authServices")


const control = new UController();

router.use(ExtractUser)

router.post('/login',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.login(method);

    res.status(ResponseHandler(status)).send(status);

});

router.post('/signup',async function(req, res){

    var method = new Method(req,res);
    
    const status = await control.signup(method,req.user);
    
    res.status(ResponseHandler(status)).send(status);

});

///////////////////////////////////////////// PUT requests


router.put('/changepass',async function(req, res){

    var method = new Method(req,res);
    
    const status = await control.changePass(method,req.user);
    
    res.status(ResponseHandler(status)).send(status);

});


////////////////////////////////////////////////////// DELETE Requests

router.delete('/logout',async function(req, res){
    
    const status = await control.logout(req.user)
    
    res.status(ResponseHandler(status)).send(status);
    

});




module.exports = router;










