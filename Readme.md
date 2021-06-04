Followings are the backend endpoints for the ExamsNJ management web app.


<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Authorization End Points>>>>>>>>>>>>>>>>>>>>>>>>>

<<<<<<<<<<<login>>>>>>>>>>>>>>>>>> 

URL: POST > localhost:5000/auth/login

Body:

{
    "UserName" : "meelan.17",
    "pass" : "password"
}


<<<<<<<<<<<Logout>>>>>>>>>>>>>>>>>>

URL: DELETE > localhost:5000/auth/logout


<<<<<<<<<<<Change Password>>>>>>>>>

URL: PUT > localhost:3000/api/changepass

include this in the body as a JSON object

{
    "currpassword": "pass",
    "newpassword" : "password"
}

<<<<<<<<<<<Signup new user>>>>>>>>>>>

URL: POST > localhost:5000/auth/signup

{
    "UserName" : "chamuditha.17",
    "pass" : "password",
    "type" : "regular",
    "fname": "chamuditha",
    "lname": "bandara"
}


<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<API CALL END POINTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>


<<<<< Get Exam Report >>>>>

URL: localhost:5000/api/examReport

{
        "class_name" : "nj_17",
        "exam_name" : "mock01"
                    
}

<<<<<< Register a new class >>>>>>

URL: localhost:5000/api/registerClass


{
        "class_name" : "nj_18"
                    
}


<<<<<< Add students to a class >>>>>>>

URL: localhost:5000/api/addStudentsToClass


{
        "class_name" : "nj_18",
        "id_list" : "00001,00002,00003"
                    
}


<<<<<< Add a new exam >>>>>>>

URL: localhost:5000/api/addNewExam

{
        "class_name" : "nj_18",
        "exam_name" : "mock01"
                    
}


<<<<< Add new results >>>>>>>

URL: localhost:5000/api/addNewResults

{
        "class_name" : "nj_18",
        "exam_name" : "mock01",
        "result_sheet" : {"00001":"98","00002":"78","00003":"65"}
                    
}


<<<< Summarize results >>>>>>

URL: localhost:5000/api/summarize

{
        "class_name" : "nj_18",
        "exam_name" : "mock01"
                    
}


<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< End of API calls >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>







