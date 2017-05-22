const User = require('./models/user.js');
const Student = require('./models/student.js');
const UserStudent = require('./models/user_student.js');
const Document = require('./models/document.js');
const Classes = require('./models/classes.js');
const ClassesStudent = require('./models/classes_student.js');
const ClassesTeacher = require('./models/classes_teacher.js');
const StudentHomework = require('./models/student_homework.js');
const Question = require('./models/questions.js');
const Homework = require('./models/homework.js');
const ClassesHomework = require('./models/classes_homework.js');
const services = require('../services');
var dbConfig = require('./config');
var knex = require('knex')(dbConfig);

module.exports = {
  // ADMIN PAGE: ADD USER
  insertUser : (user, callback) => {
    services.createHashPassword(user.password)
    .then((hash) => {
      User.forge({
        email: user.email,
        password: hash,
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: user.phone,
        role: user.role
        // email: '123abc@example.com',
        // password: '123',
        // first_name: 'John',
        // last_name: 'Doe',
        // phone_number: '18001234567',
        // role: 'admin'
      }).save().then(function(user) {
        callback(null, user);
      }).catch(function(err) {
        callback(err, null);
      });
    }).catch((err) => {
      if (err) console.log('hash password error:', err);
    });
  },

  // LOGIN PAGE: GET USER BY EMAIL
  selectUser : (user, callback) => {
    User.forge({email: user.email})
    .fetch({require: true})
    .then(function (user) {
      callback(null, user);
    })
    .catch(function (err) {
      callback(err, null);
    });
  },

  selectUserById : (userId, callback) => {
    User.forge({id: userId})
    .fetch({require: true})
    .then(function (user) {
      callback(null, user);
    })
    .catch(function (err) {
      callback(err, null);
    });
  },

  selectAllUsersByRole: (role, cb) => {
    User
    .where('role', role)
    .fetchAll()
    .then((collection) => {

      return cb(null, collection);
    })
    .catch((err) => {
      return cb(err, null);
    })
  },

  // ADMIN PAGE: ADD STUDENT
  insertStudent : (student, callback) => {
    Student.forge({
      first_name: student.firstName,
      last_name: student.lastName,
      email: student.email,
      gpa: student.gpa,
      attendance: student.attendance,
      photo: student.photo
    }).save()
    .then(function(student) {
      callback(null, student);

    })
    .catch(function(err) {
      callback(err, null);
    });
  },

  // ADMIN PAGE: SET STUDENT RELATION (TEACHER OR PARENT)
  insertUserStudent : (id_user, student_id) => {
    UserStudent.forge({
      id_user: id_user,
      id_student: student_id
    }).save()
    .then(function(student) {
      console.log('SUCCESSFUL INSERT IN JOIN TABLE:', student);
    })
    .catch(function(err) {
      console.log('ERROR WITH INSERT IN JOIN TABLE:', err);
    });
  },

  // ADMIN PAGE: GET ALL STUDENTS
  selectAllStudents : (callback) => {
    Student.collection().fetch()
    .then(function(students) {
      callback(null, students);
    }).catch(function(err) {
      callback(err, null);
    });
  },

  selectStudent : (id_student, callback) => {
    Student.forge({id: id_student})
    .fetch({required: true})
    .then(student => {
      callback(null, student);
    })
    .catch(error => {
      callback(error, null);
    });
  },

  selectStudentOptions : (options, callback) => {
    Student
    .query('where', options)
    .fetch()
    .then(student => {
      callback(null, student);
    })
    .catch(error => {
      callback(error, null);
    });
  },

  // DOC PAGE: GET SELECTED STUDENTS
  retrieveSelectedUsersStudents : (id_user, callback) => {
    UserStudent.forge()
    .query('where', {id_user: id_user})
    .fetchAll({require: true})
    .then(userStudentEntry => {
      callback(null, userStudentEntry);
    })
    .catch(error => {
      callback(error, null);
    });
  },

  insertDocument : (doc, callback) => {
    Document.forge({
      title: doc.title,
      body: doc.body,
      id_student: doc.studentId,
      first_name_student: doc.studentFirstName,
      last_name_student: doc.studentLastName
    })
    .save()
    .then(doc => {
      console.log('SUCCESSFUL INSERT IN DOCUMENTS TABLE:', doc);
      callback(null, doc);
    })
    .catch(error => {
      console.log('ERROR WITH INSERT IN DOCUMENTS TABLE:', error);
      callback(error, null);
    });
  },

  selectApplicableDocuments : (id_student, callback) => {
    // Selects all applicable documents depending on the student_ids for each document.
    Document.forge()
    .query('where', {id_student: id_student})
    .fetchAll({require: true})
    .then(documentEntry => {
      callback(null, documentEntry)
    })
    .catch(error => {
      callback(error, null);
    });
    // Must refer to the users_students join table for reference the user_id to get the relevant student_id.

    // Then select only the documents where the student_id matches that retrieved from the join table.
  },

  selectAllDocuments : (callback) => {
    Document.collection
    .fetch()
    .then(documents => {
      callback(null, documents);
    })
    .catch(error => {
      callback(error, null);
    });
  },

  updatePermission : (returnedDoc, callback) => {
    Document
    .forge({id: returnedDoc.docId})
    .save({permissioned: returnedDoc.permissioned})
    .then(doc => {
      console.log('SUCCESSFUL UPDATE OF DOCUMENT PERMISSION STATUS:', doc);
      callback(null, doc);
    })
    .catch(error => {
      console.log('ERROR UPDATING DOCUMENT PERMISSION STATUS', error);
      callback(error, null);
    })
  },

  //admin activity for classes

  insertClass : (classObj, callback) => {
    Classes
    .forge(classObj)
    .save()
    .then(classRow => {
      console.log('SUCCESSFUL UPDATE OF CLASS:', classRow);
      callback(null, classRow);
    })
    .catch(error => {
      console.log('ERROR UPDATING CLASS', error);
      callback(error, null);
    })
  },

  selectAllClasses : (callback) => {
    Classes.collection().fetch()
    .then(function(classes) {
      callback(null, classes);
    }).catch(function(err) {
      callback(err, null);
    });
  },

  insertClassesTeachers : (class_id, teacher_id) => {
    ClassesTeacher
    .forge({
      class_id: class_id,
      teacher_id: teacher_id
     })
    .save()
    .then((relationship) => {
      console.log('SUCCESSFUL INSERT IN CLASSESTEACHERS');
    })
    .catch((err) => {
      console.log('ERROR WITH INSERT IN CLASSESTEACHERS');
    })
  },

  selectClassesTeacher : (options, callback) => {
    ClassesTeacher
    .query('where', options)
    .fetch()
    .then(function (classesTeacher) {
      callback(null, classesTeacher);
    })
    .catch(function (err) {
      callback(err, null);
    });
  },

  selectAllClassesTeacher : (options, callback) => {
    ClassesTeacher
    .query('where', options)
    .fetchAll()
    .then(function (classesTeacher) {
      callback(null, classesTeacher);
    })
    .catch(function (err) {
      callback(err, null);
    });
  },

  selectClassesById : (options, callback) => {
    Classes
    .query('where', options)
    .fetchAll()
    .then(function (classes) {
      callback(null, classes);
    })
    .catch(function (err) {
      callback(err, null);
    });
  },

  insertClassesStudent : (class_id, student_id) => {
    ClassesStudent
    .forge({
      class_id: class_id,
      student_id: student_id
     })
    .save()
    .then((relationship) => {
      console.log('SUCCESSFUL INSERT IN CLASSESSTUDENTS');
    })
    .catch((err) => {
      console.log('ERROR WITH INSERT IN CLASSESSTUDENTS');
    })
  },

  // GRADES PAGE: GET ALL ClASSES
  selectAllClassesForUser: (user, callback) => {
    Classes.collection().fetch()
    .then(function(classes) {
      callback(null, classes);
    }).catch(function(err) {
      callback(err, null);
    });
  },

  selectStudentsPerClass : (id_class, callback) => {
    ClassesStudent.forge()
    .query('where', {class_id: id_class})
    .fetchAll({require: true})
    .then(classStudentEntry => {
     // console.log("***************",classStudentEntry);
      var studentIds =[];
      var studentGrades={};
      classStudentEntry.forEach(function(i,v){
        studentIds.push(i.get('student_id'));
        studentGrades[i.get('student_id')] = i.get('grade');
      });
          Student.forge()
          .where('id','in',studentIds)
          .fetchAll({require: true})
          .then(students => {
             // console.log('got students');
              students.forEach(function(student){
                student.set('grade',studentGrades[student.get('id')]);
              });
            callback(null, students)
          })
          .catch(error => {
            callback(error, null);
          });
    })
    .catch(error => {
      callback(error, null);
    });
  },

  updateGradesForClass: (gradeData, callback) =>{
    var id_class = gradeData.id_class;
    var grades = gradeData.grades;
    for(var i of grades){
      ClassesStudent.forge()
      .where({class_id: id_class, student_id: i.id})
      .save({grade:i.grade},{patch: 'true'})
      .then(classStudent => {
        callback(null, classStudent);
      })
      .catch(err => {
        callback(err, null);
      });
    }
  },

  insertGradesForClass: (gradeData, callback) =>{
    for(var i of gradeData){
      StudentHomework.forge({student_id: i.student_id, homework_id: i.homework_id, grade: i.grade})
      .save()
      .then((res)=>{
        if(res.get('id')===gradeData[gradeData.length-1].id){
          callback(null,res);
        }
      })
      .catch((err)=>{
        callback(err, null);
      })
    }
  },
  //questions
  insertQuestion : (options, cb) => {
    Question
    .forge(options)
    .save()
    .then((question) => {
      cb(null, question);
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  fetchQuestions : (options, cb) => {
    Question
    .query('where', options)
    .fetchAll()
    .then((questions) => {
      cb(null, questions)
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  //homework
  insertHomework : (options, cb) => {
    Homework
    .forge(options)
    .save()
    .then((homework) => {
      cb(null, homework);
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  fetchHomework : (options, cb) => {
    Homework
    .query('where', options)
    .fetchAll()
    .then((homework) => {
      cb(null, homework)
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  insertAssignedForms : (options, cb) => {
    ClassesHomework
    .forge(options)
    .save()
    .then((relation) => {
      cb(null, relation);
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  fetchClassesHomework : (options, cb) => {
    ClassesHomework
    .query('where', options)
    .fetchAll()
    .then((relations) => {
      cb(null, relations);
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  //classes functions
  fetchStudentsInClass : (options, cb) => {
    ClassesStudent
    .query('where', options)
    .fetchAll()
    .then((relations) => {
      cb(null, relations);
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  fetchAssignedForms : (options, cb) => {
    ClassesHomework
    .query('where', options)
    .fetchAll()
    .then((relation) => {
      cb(null, relation)
    })
    .catch((err) => {
      cb(err, null);
    })
  },

  //STUDENT HOMEPAGE: GRADES

  fetchGradesOld: (first_name, callback) => {
    console.log(first_name);
    Student
     .query({ where: {first_name: first_name }})
     .fetch()
     .then(student => {
      console.log(student)
      StudentHomework.forge({ student_id: student.id })
        .fetchAll()
        .then(grades => {
          callback(null, grades)
          })
          .catch((err) => {
            callback(err, null);
          })
      })
  },
  fetchGrades: (first_name, callback) => {
    knex.table('student_homework').innerJoin('students', 'students.id', '=', 'student_homework.student_id')
    .innerJoin('homework', 'student_homework.homework_id', '=', 'homework.id')
    .where({first_name:first_name})
    .then(function(res){
      callback(null, res)
    })
    .catch((err) => {
      callback(err, null)
    })
  }

};

/*
USE DATABASE COMMAND BELOW TO CLEAR ALL TABLES...
DROP TABLE IF EXISTS users, students, users_students CASCADE;
*/


/*
// ADMIN PAGE: DELETE USER BY EMAIL
User.forge({email: 'abc123@example.com'})
.fetch({require: true})
.then(function (category) {
  category.destroy()
  .then(function () {
    console.log('Category successfully deleted');
  })
  .catch(function (err) {
    console.log('message:', err.message);
  });
})
.catch(function (err) {
  console.log('message:', err.message);
});
// ADMIN PAGE: ADD STUDENT
Student.forge({
  first_name: 'Jimmy',
  last_name: 'John'
}).save().then(function(newRow) {
  console.log(newRow.id); // Returns ID of new row
}).catch(function(err) {
  console.log(err);
});
// ADMIN PAGE: GET ALL USERS
User.collection().fetch().then(function(users) {
   console.log(JSON.stringify(users)); // collection of users
});
// ADMIN PAGE: GET ALL STUDENTS
Student.collection().fetch().then(function(users) {
   console.log(JSON.stringify(users)); // collection of users
});
// ADMIN PAGE: DELETE USER BY ID
User.forge({id: 1}).fetch().then(function (item) {
  return item.destroy().then(function () {
      console.log('destroyed!');
    });
});
// ADMIN PAGE: DELETE STUDENT BY ID
Student.forge({id: 1}).fetch().then(function (item) {
  return item.destroy().then(function () {
      console.log('destroyed!');
    });
});
*/
