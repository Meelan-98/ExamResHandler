const {executeSQL} = require("../DB/db");
// const uniqid = require('uniqid');
const intid = require("intid")

class Student{

    constructor(index,name,school,batch,mobile,address){
        this.index=index;
        this.name=name;
        this.exam_id = intid(8);
        this.batch=batch;
        this.address=address;
        this.mobile=mobile;
        this.school=school;
        
    }

    async register(){
        try{
            const status = await executeSQL('INSERT INTO student VALUES (?,?,?,?,?,?,?)',[this.index,this.name,this.exam_id,this.batch,this.address,this.mobile,this.school])
            return(status)
        }catch(e){
            return("Error registering the student");
        }
        
    }

    // async editDetails(name,school,batch,mobile,address){


    //     try{

    //         if(name){
    //             this.name=name;
    //             await executeSQL(`UPDATE student SET name = ? WHERE index_number = ?`,[this.name,this.index]);
    //         }
    
    //         if(school){
    //             this.school=school;
    //             await executeSQL(`UPDATE student SET school = ? WHERE index_number = ?`,[this.school,this.index]);
    //         }
    
    //         if(batch){
    //             this.batch=batch;
    //             await executeSQL(`UPDATE student SET batch = ? WHERE index_number = ?`,[this.batch,this.index]);
    //         }
    
    //         if(mobile){
    //             this.mobile=mobile;
    //             await executeSQL(`UPDATE student SET mobile = ? WHERE index_number = ?`,[this.mobile,this.index]);
    //         }
    
    //         if(address){
    //             this.address=address;
    //             await executeSQL(`UPDATE student SET address = ? WHERE index_number = ?`,[this.address,this.index]);
    //         }
    
    //         return("Successfully updated the student record")
    
    //     }catch(e){

    //         return("Error at St 59")
    //     }
        
    // }
}


module.exports = Student;