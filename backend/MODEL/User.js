const uniqid = require('uniqid');
const ACCESS_TOKEN_SECRECT = "ExamNJ";
const {sign, verify} = require("jsonwebtoken");
const {hash,compare} = require("bcryptjs");
const {executeSQL} = require("../DB/db");
const LeClass = require('../MODEL/LeClass');
const Student = require('../MODEL/Student')

class User {

    constructor(username,fname,lname,idVal){
        
        this.username = username;

        if (fname){
            this.fname = fname;
        }else{

            this.fname = null;
        }

        if (lname){
            this.lname = lname;
        }else{

            this.lname = null;
        }

        this.type = "general";
        
        if(idVal){
            this.sessionID = idVal;
        }else{
            this.sessionID = uniqid();
        }
        
        this.lastUsedTime = Number(new Date().getTime());
        
    }

    async  login(users,pass){
    
        const username = this.username;
        const password = pass;
    
        
        
        try{
    
            const credential = await executeSQL('SELECT username,fname,lname,type,password FROM user_table WHERE username =?',[username]);

            const status = await compare(password,credential[0].password);
            
            
            
            if (status){

                this.type = credential[0].type;
                this.fname = credential[0].fname;
                this.lname = credential[0].lname;
    
    
                if (users.has(username)){
    
                    users.delete(username);
    
                    await executeSQL('delete from session_table  WHERE username= ?',[this.username]);

                    console.log("User Already Exists, logging out previous users");

                    await executeSQL('INSERT INTO session_table VALUES (?,?,?)',[this.username,this.sessionID,Number(new Date().getTime())]);
 
    
                }else{
    
                    try{

                        await executeSQL('INSERT INTO session_table VALUES (?,?,?)',[this.username,this.sessionID,Number(new Date().getTime())]);

                    }
                    catch(e){
                        console.log(e)
                        console.log("Error at user 83");
                    }
                }

                users.set(username,this);
                
                const token = sign({sessionID:this.sessionID,UserName:this.username}, ACCESS_TOKEN_SECRECT,{expiresIn:"500m"});
    
                console.log(username + " Successfully Logged In !!!");
    
                return ({"package":{"token":token,"user":this,"type":this.type},"users":users});
        
            }else{
                return("Error at user 96");
            }
    
        }catch(e){
            return("Error at user 100");
        }
    
        
        
    }

    async logout(users){

        try{
            users.delete(this.username);
            await executeSQL('DELETE FROM session_table WHERE username= ?',[this.username]);
        }
        catch(e){
            console.log("database error");
            return({"users":users,"package":"database error"})
        }
        
        console.log(this.username + " logged out succesfully !!!")

        return({"users":users,"package":"successfully logged out"})
    
    }

    async changePass(CurrPassword,NewPassword){
        
        
        var credential,hashedPass,success;

        try{
            
            credential = await executeSQL(`SELECT username,password FROM user_table WHERE username = ?`,[this.username]); 
            hashedPass = credential[0].password;
            success = await compare(CurrPassword,hashedPass); 
        }
        catch(e){
            return ("Error131");
        }   
        
        if(success){
            try{
                
                const hashedPassword = await hash(NewPassword,10);
                await executeSQL(`UPDATE user_table SET password = ? WHERE username = ?`,[hashedPassword,this.username]); 
                    
                return ("Password Changed");
               
            }catch(e){
                return(e);
            }   
        }else{
            return("Error146");
        }
                
        
    }

    async setLastUsedTime(){

        this.lastUsedTime = Number(new Date().getTime());
        try{
            await executeSQL(`UPDATE session_table SET last_used_time= ? WHERE username = ?`,[Number(this.lastUsedTime),this.username]);
        }catch(e){
            console.log(e)
            console.log("Error user 158");
        }
        
    }


}


class adminUser extends User{

    constructor(username,fname,lname,session_id){

        super(username,fname,lname,session_id)

        this.type = "admin"

    }

    async signup(method){

        console.log("camhe gege")
    
        if(this.type == "regular"){
            return ("AccessDenied");
        }else{
            const body = method.getBody();
    
            const username = body.UserName;
            const password = body.pass;
            const type     = body.type;
            const fName    = body.fname;
            const lName    = body.lname;
    
            
    
            if(type!="admin" && type!="regular"){

                console.log("camhe gege")
                return("Error");
            }
    
            try{
    
                
                const data = await executeSQL('SELECT username FROM user_table WHERE username = ?',[username]);
                
                if(data[0]){
    
                    return ("Error");
                
                }else{
                    
                    
                    const hashedPassword = await hash(password,10);
                    
                    await executeSQL('INSERT INTO user_table SET ?',{username:username,fname:fName,lname:lName,type:type,password:hashedPassword});
                    
                    console.log(username + " successfuly added");
                    return ("User added");
                }
    
            }catch(e){
                console.log(e)
                return ("Error");
                
            }  
        }
    
         
    }

    async registerClass(cname){

        const lClass = new LeClass(cname);

        var status;

        try{
            status = await lClass.registerClass();
        }catch(e){
            console.log(e)
        }
        return(status);
    }

    async addStudentsToClass(cname,id_list){

        const lClass = new LeClass(cname);

        var status;

        try{
            status = await lClass.regStudents(id_list);
        }catch(e){
            console.log(e)
        }
        return(status);

    }

    async addNewExam(cname,ename){

        const lclass = new LeClass(cname);

        var status;

        try{
            status = await lclass.regNewExam(ename);
        }catch(e){
            console.log(e);
        }

        return(status);
    }

    async addNewResults(cname,ename,results){

        const lclass = new LeClass(cname);

        var status;

        try{

            status = await lclass.enterResults(ename,results);

        }catch(e){
            console.log(e);
        }

        return(status)
    }

    async updateSummary(cname,ename){

        const lclass = new LeClass(cname);

        var status;

        try{

            status = await lclass.summarizeResults(ename);

        }catch(e){
            console.log(e);
        }

        return(status)

    }

    async generateReport(cname,ename){

        const lclass = new LeClass(cname);

        var status;

        try{

            status = await lclass.examReport(ename);

        }catch(e){
            console.log(e);
        }

        return(status)

    }

    async getClassesAvailable(){

        var status;

        try{

            status = await executeSQL('SELECT * FROM classes');

        }catch(e){

            console.log(e);
        
        }

        return(status)

    }

    async getExamsAvailable(cName){

        var status;

        try{

            console.log(cName)

            status = await executeSQL('SHOW COLUMNS FROM ' + cName);

        }catch(e){

            console.log(e);
        
        }

        return(status)

    }

    async getClassStudents(cName){

        const lclass = new LeClass(cName);

        var status;

        try{

            status = await lclass.getAllStudents();

        }catch(e){
            console.log(e);
        }

        return(status)

    }

    async registerStudentsToDB(Dsheet){

        var errorSet = [];
        
        
        try{

            for (var i = 1; i < Dsheet.length; i++) {
                const data = (Dsheet[i]);
    
                const student = new Student(data[0],data[1],data[5],data[2],data[4],data[3]);
    
                const status = await student.register();
    
                if(status=="Error registering the student"){
                    errorSet.push(data[0])
                }
            }

            if(errorSet.length==0){
                return("Registration Successful !!!")
            }else{
                return({"Error_Set":errorSet})
            }

        }catch(e){
            return("Registration Failed")
        }
        



        // var status;

        // try{

        //     status = await lclass.getAllStudents();

        // }catch(e){
        //     console.log(e);
        // }

        return("Testing")

    }

}


module.exports = {User,adminUser}