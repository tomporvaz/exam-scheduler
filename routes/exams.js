const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


//exam schema and model
const examSchema = new Schema({
  courseId: {type: ObjectId, required: true, ref: 'Course'},
  examName: {type: String, required: true},
  examDate: {type: String},
  examStart: {type: String},
  examEnd: {type: String},
  examSoftware: {type: String},
  examSemester: {type: String, required: true},
  examDuration: {type: Number},
  emailFaculty: {type: Boolean},
  facultyConfirmed: {type: Boolean},
  building: {type: String},
  room: {type: String},
  examNotes: {type: String},
  supportPerson: {type: String},
  approved: {type: Boolean}
})

const Exam = mongoose.model('Exam', examSchema);
function examRoutes (app) {
  app.route('/api/exams')
  
  .post(function (req, res) {
    const newExam = new Exam({
      courseId: req.body.courseId,
      examName: req.body.examName,
      examDate: req.body.examDate,
      examStart: req.body.examStart,
      examEnd: req.body.examEnd,
      examSoftware: req.body.examSoftware,
      examSemester: req.body.examSemester,
      examDuration: req.body.examDuration,
      emailFaculty: req.body.emailFaculty,
      facultyConfirmed: req.body.facultyConfirmed,
      building: req.body.building,
      room: req.body.room,
      examNotes: req.body.examNotes,
      supportPerson: req.body.supportPerson,
      approved: req.body.approved
    })
    
    newExam.save(function (err, doc){
      if(err){console.error(err)}
      else{
        let savedDoc = {...doc._doc};
        savedDoc.examId = savedDoc._id;
        delete savedDoc._id;
        res.json(savedDoc)}
      })
    })
    
    .get(function (req, res) {
      Exam.find({examSemester: req.query.semester})
      .populate('courseId')
      .exec(
        function(err, doc){
          if(err){console.error(err)}
          else{
            //flatten course data forEach exam into itself and update _id to examId
            let arrFlatExams = doc.map((exam) => {
              let newExam = {...exam._doc};
              
              //change exam._id to examId
              newExam.examId = newExam._id;
              delete newExam._id;

              //spread newExam and courseId to flatten course
              newExam = {...newExam, ...newExam.courseId._doc}

              //change courseId._id to courseId
              newExam.courseId = newExam.courseId._id;
              
              delete newExam._id;
              delete newExam.__v

              return newExam;
            })
            res.json(arrFlatExams);   
          }
        })
      })
    }
    exports.examSchema = examSchema;
    exports.Exam = Exam;
    exports.examRoutes = examRoutes;
    