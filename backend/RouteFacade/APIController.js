var express = require('express');
var router = express.Router();

const {ResponseHandler} = require("../Controller/ResponseController");

const Method = require("../Controller/method");
const {UController} = require("../Controller/UserController")
const {ExtractUser} = require("../Services/authServices")


const control = new UController();

router.use(ExtractUser)

router.post('/getAvailableStudents',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.getStudents(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});

router.post('/getAvailableExams',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.getExams(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});

router.get('/getCurrentClasses',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.getClasses(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});

router.post('/registerClass',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.classRegistration(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});


router.post('/addStudentsToClass',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.addStudentsToClass(method,req.user);

    console.log(status);

    res.status(ResponseHandler(status)).send(status);

});


router.post('/addNewExam',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.addNewExam(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});


router.post('/addNewResults',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.enterResults(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});


router.post('/summarize',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.summarizeResult(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});


router.post('/examReport',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.getExamReport(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});

router.post('/registerStudents',async function(req, res){

    var method = new Method(req,res);
    
    var status = await control.registerStudents(method,req.user);

    res.status(ResponseHandler(status)).send(status);

});









module.exports = router;