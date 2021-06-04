const {User,adminUser} = require("../MODEL/User")

const {compare} = require("bcryptjs");
const {executeSQL} = require("../DB/db");
const {sign} = require("jsonwebtoken");
const ACCESS_TOKEN_SECRECT = "ExamNJ";


var users = new Map();

class UController{

    async login(method){

        const body = method.getBody();

        const username = body.UserName;
        const password = body.pass;

        const status = await logger(username,password,users)

        this.users = status["users"]

        console.log(users)

        return(status["package"])

    }

    async signup(method,user){

        const status = await user.signup(method);

        return(status)

    }

    async logout(user){

        try{
            const status = await user.logout(users);

            this.users = status["users"]

            return(status["package"])
        }catch(e){
            console.log(e)
        }

        
    }

    async changePass(method,user){

        const body = method.getBody();

        var CurrPassword = body.currpassword;
        var NewPassword = body.newpassword;

        try{

            return(await user.changePass(CurrPassword,NewPassword));

        }catch(e){
        
            return("Error60 ucontrol")
        }
        
    }

    ////////////////////////////////////////////////////////////////// API Handling tasks


    async classRegistration(method,user){

        const body = method.getBody();

        const cName = body.class_name;

        try{

            return(await user.registerClass(cName));

        }catch(e){

            return("Error at uControl 80")
        }


    }

    async addStudentsToClass(method,user){

        const body = method.getBody();

        const cName = body.class_name;
        const id_List = body.id_list;

        try{

            const result = await user.addStudentsToClass(cName,id_List);
            return(result)

        }catch(e){
        
            return("Error at uControl 99")
        }

    }

    async addNewExam(method,user){

        const body = method.getBody();

        const cName = body.class_name;

        const eName = body.exam_name;

        try{

            return(await user.addNewExam(cName,eName));

        }catch(e){

            return("Error adding new exam at uControl 118")
        }
    }

    async enterResults(method,user){

        const body = method.getBody();

        const cName = body.class_name;

        const eName = body.exam_name;

        const results = body.result_sheet;

        try{

            return(await user.addNewResults(cName,eName,results));

        }catch(e){

            return("Error adding new exam at uControl 138")
        }

    }

    async summarizeResult(method,user){

        const body = method.getBody();

        const cName = body.class_name;

        const eName = body.exam_name;

        try{

            return(await user.updateSummary(cName,eName));

        }catch(e){

            console.log(e)

            return("Error summarizing results at uControl 157")
        }

    }

    async getExamReport(method,user){

        const body = method.getBody();

        const cName = body.class_name;

        const eName = body.exam_name;

        try{

            return(await user.generateReport(cName,eName));

        }catch(e){

            console.log(e)

            return("Error generating exam report at uControl 180")
        }

    }

    async getClasses(method,user){

        const body = method.getBody();

        try{

            return(await user.getClassesAvailable());

        }catch(e){

            console.log(e)

            return("Error generating exam report at uControl 180")
        }

    }

    async getExams(method,user){

        const body = method.getBody();

        const cName = body.class_name;

        try{

            return(await user.getExamsAvailable(cName));

        }catch(e){

            console.log(e)

            return("Error generating exam report at uControl 180")
        }

    }

    async getStudents(method,user){

        const body = method.getBody();

        const cName = body.class_name;

        try{

            return(await user.getClassStudents(cName));

        }catch(e){

            console.log(e)

            return("Error generating exam report at uControl 180")
        }

    }

    async registerStudents(method,user){

        const body = method.getBody();

        const Dsheet = body.data_sheet;

        try{

            return(await user.registerStudentsToDB(Dsheet));

        }catch(e){

            console.log(e)

            return("Error registering students")
        }

    }

}

function getUsers(){
    return(users)   
}


var logger = async function(Username,pass,userss){
    
    const username = Username;
    const password = pass;

    try{

        const credential = await executeSQL('SELECT username,fname,lname,type,password FROM user_table WHERE username =?',[username]);

        const status = await compare(password,credential[0].password);

        const value = credential[0];
        
        if (status){

            if ( value.type = "admin"){
    
                var user = new adminUser(value.username,value.fname,value.lname)
    
            }else{
    
                var user = new User(value.username,value.fname,value.lname)  
                
            }


            if (userss.has(username)){

                userss.delete(username);

                await executeSQL('delete from session_table  WHERE username= ?',[username]);

                console.log("User Already Exists, logging out previous users");

                await executeSQL('INSERT INTO session_table VALUES (?,?,?)',[username,user.sessionID,Number(new Date().getTime())]);


            }else{

                try{

                    await executeSQL('INSERT INTO session_table VALUES (?,?,?)',[username,user.sessionID,Number(new Date().getTime())]);

                }
                catch(e){
                    console.log(e)
                    console.log("Error at user 83");
                }
            }

            userss.set(username,user);
            
            const token = sign({sessionID:user.sessionID,UserName:username}, ACCESS_TOKEN_SECRECT,{expiresIn:"500m"});

            console.log(username + " Successfully Logged In !!!");

            return ({"package":{"token":token,"user":user,"type":value.type},"users":userss});
    
        }else{
            return("Error at user 96");
        }

    }catch(e){
        console.log(e)
        return("Error at user 100");
    }

    
    
}


module.exports ={UController,getUsers}