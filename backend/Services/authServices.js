
const Method = require("../Controller/method");
const ACCESS_TOKEN_SECRECT = "ExamNJ";
const {User,adminUser} = require("../MODEL/User")
const {executeSQL} = require("../DB/db");
const {verify} = require("jsonwebtoken");


var {getUsers} = require("../Controller/UserController");


var ExtractUser =async function(req,res,next){

    var method = new Method(req,res);

    var token = method.getToken();

    const users = getUsers();

    if(token){
    
        try{

            const {sessionID,UserName} = verify(token,ACCESS_TOKEN_SECRECT);
    
            if(sessionID){
                
                var user = users.get(UserName);

                if(user.sessionID == sessionID){
                    
                    await user.setLastUsedTime();
                    req.user = user;

                    next();
                }else{

                    console.log("Invalid token")
                    res.sendStatus(203);

                }   
            }
    
            
        }
        catch(err){

            console.log("Invaild or missing token"); //when token expires
            res.sendStatus(203);

        }
    }else{
        next();
    }  
    
}


var RestoreSession = async function(){

    console.log("Restoring Sessions");

    const users = getUsers();

    var data = null;

    try{
        data = await executeSQL('SELECT * FROM session_table LEFT JOIN user_table on session_table.username = user_table.username');
    }catch(e){
        console.log("error");
    }
   

    for (const [key, value] of data.entries()){

        if (value.type = "admin"){

            console.log(value.username + ' logged in');

            var user = new adminUser(value.username,value.fname,value.lname,value.session_id)

        }else{

            var user = new User(value.username,value.fname,value.lname,value.session_id)  
            
        }
        
        users.set(value.username,user)
    
    }

}


module.exports = {ExtractUser,RestoreSession}
