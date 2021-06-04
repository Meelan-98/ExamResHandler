const {executeSQL} = require("../DB/db");

class LeClass{

    constructor(cname){

        this.cName = cname;
        this.rName = cname + "_ranks"
        this.sName = cname + "_summary"

    }

    async registerClass(){

        try{
            await executeSQL('CREATE TABLE ' + this.cName + '(exam_id VARCHAR(45) NOT NULL,PRIMARY KEY (`exam_id`))');  
            await executeSQL('CREATE TABLE ' + this.rName + '(exam_id VARCHAR(45) NOT NULL,PRIMARY KEY (`exam_id`))'); 
            await executeSQL('CREATE TABLE ' + this.sName + '(exam_name VARCHAR(45) NOT NULL, average INT NULL, first_place VARCHAR(45) NULL, maximum_marks VARCHAR(45) NULL,PRIMARY KEY (`exam_name`))'); 
            await executeSQL('INSERT INTO classes (`class_name`) VALUES (?)',[this.cName]);

            return("successfully registered the class");

        }catch(e){

            console.log(e)
            return("Error when resitering the class please check")
            
        }


    }

    async regStudents(examIdList){

        var errorSet = [];

        var idList = examIdList.split(',')


        for (const exam_id of idList){

            const availability = await executeSQL('SELECT index_number FROM student WHERE exam_id = ? ' ,[exam_id]);

            if(availability[0]){

                try{
                    await executeSQL('INSERT INTO ' +  this.cName + ' (exam_id) VALUES (?)',[exam_id])
                    await executeSQL('INSERT INTO ' +  this.rName + ' (exam_id) VALUES (?)',[exam_id])
                }catch(e){
                    console.log(exam_id + "already exists")
                    errorSet.push(exam_id);
                }

            }else{
                
                errorSet.push(exam_id);
                console.log(exam_id + "Invalid exam id");

            }
           
        }

        return({"Error Set":errorSet});

    }

    async regNewExam(exam_name){

        try{

            await executeSQL('ALTER TABLE ' + this.cName +  ' ADD COLUMN ' + exam_name + ' VARCHAR(45)')

            return("succesfully added the exam to: " + this.cName);

        }catch(e){

            return("error adding the exam please check")
        }

    }

    async enterResults(ename,results){

        var errorSet = []

        for (var key in results){

            const mark = results[key]

            const availability = await executeSQL('SELECT exam_id FROM ' + this.cName + ' WHERE exam_id = ?',[key])

            if (availability[0]){

                try{
                    await executeSQL('UPDATE ' + this.cName +  ' SET ' +  ename + ' = ' + mark + ' WHERE exam_id = ?',[key])
                }catch(e){
                    errorSet.push(key);
                }

            }else{

                errorSet.push(key);

            }
        }

        return({"Invalid id numbers" : errorSet})

    }

    async summarizeResults(ename){

        var results;

        try{
            await executeSQL('ALTER TABLE ' + this.rName +  ' ADD COLUMN ' + ename + ' VARCHAR(45)')  
        }catch(e){
            console.log("Coloumn already exists")
        }


        try{
            results = await executeSQL('SELECT exam_id,' + ename + ' FROM ' + this.cName + ' ORDER BY ' + ename + ' DESC');
        }catch(e){
            console.log(e);
        }

        var avg = 0;

        for (var key in results){

            avg = avg + Number(results[key][ename]);

            const rank = Number(key) + 1 

            try{
                console.log('UPDATE ' + this.rName +  ' SET ' +  ename + ' = ' + rank + ' WHERE exam_id = ?',[results[key]['exam_id']])
                await executeSQL('UPDATE ' + this.rName +  ' SET ' +  ename + ' = ' + rank + ' WHERE exam_id = ?',[results[key]['exam_id']])
            }catch(e){
                console.log(e)
                return("Ranking Failed at: " + results[key]['exam_id'])
            }

        }

        avg = avg/(results.length);
        
        var first;
        var second;
        var third;

        try{

            first = await executeSQL('SELECT name,school FROM student WHERE exam_id = ?',[results[0]['exam_id']]);
            second = await executeSQL('SELECT name,school FROM student WHERE exam_id = ?',[results[1]['exam_id']]);
            third = await executeSQL('SELECT name,school FROM student WHERE exam_id = ?',[results[2]['exam_id']]);

            first[0]["mark"] = results[0][ename];
            second[0]["mark"] = results[1][ename];
            third[0]["mark"] = results[2][ename];

        }catch(e){
            console.log(e)
        }

        try{

            await executeSQL('INSERT INTO ' + this.sName + ' (`exam_name`, `average`, `first_place`, `maximum_marks`) VALUES (?,?,?,?)',[ename,avg,results[0]['exam_id'],results[0][ename]]);

        }catch(e){
            console.log("summary db action failed")
        }

        

        console.log(first,second)
        return({"Average":avg,"1":first,"2":second,"3":third})
        
    }


    async examReport(ename){

        try{

            const summary = await executeSQL('SELECT exam_name,average,first_place,maximum_marks,name FROM ' + this.sName + ' LEFT OUTER JOIN student ON ('+ this.sName + '.first_place = student.exam_id) WHERE exam_name = ?',[ename]);

            const result_sheet = await executeSQL('SELECT ' + this.cName +'.exam_id,' + this.cName + '.'+ ename + ' AS mark,' + this.rName + '.' + ename + ' FROM ' + this.cName + ' LEFT OUTER JOIN ' + this.rName + ' ON ' + this.cName + '.exam_id = ' + this.rName + '.exam_id');

            return({"summary":summary, "result sheet":result_sheet})

        }catch(e){

            console.log(e)
            
            return('Error')
        }

        

    }


    async getAllStudents(){

        try{

            const summary = await executeSQL('SELECT exam_id FROM ' + this.cName);

            return(summary)

        }catch(e){

            console.log(e)
            
            return('Error')
        }   

    }


}



module.exports = LeClass



