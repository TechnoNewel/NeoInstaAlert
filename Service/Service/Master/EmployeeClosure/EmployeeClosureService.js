var express = require('express');
var router = express.Router();
var connect = require('../../../Data/Connect');
var datamodel = require('../../../Data/DataModel');
var dataaccess = require('../../../Data/DataAccess');
var dataconn = require('../../../Data/DataConnection');
var multer = require("multer");
const path = require('path');
var upload = multer();
const fse = require("fs-extra");
const fs = require("fs");
const config = require('../../../Config');
var Sequelize = connect.Sequelize;
const Op = Sequelize.Op;
//const sequelize = connect.Sequelize;
var express = require('express');
const util = require("util");
global.dir = "files";
global.userimg = '';
global.fileuploads = "";
const baseUrl = "http://localhost:1339/api/uploadfile/getfiles/";//"http://localhost:1339/getfiles/";
const baseUrl2 = "http://localhost:1339/api/uploadfile/getvideofiles/";
global.fileuploadsName = "";
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

var routes = function () {


    const videoStorage = multer.diskStorage({
        destination: 'videos', // Destination to store video 
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + Date.now()
                + path.extname(file.originalname))
        }
    });

    const videoUpload = multer({
        storage: videoStorage,
        limits: {
            fileSize: 10000000 // 10000000 Bytes = 10 MB
        },
        fileFilter(req, file, cb) {
            // upload only mp4 and mkv format
            if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
                return cb(new Error('Please upload a video'))
            }
            cb(undefined, true)
        }
    });

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'Uploads'); // Destination folder on the server
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname); // Keep the original file name
        },
    });

    const upload = multer({ storage });



    // router.post("/uploadfile", function (req, res, next) {
    //     upload.single('file')(req, res, function (err) {
    //         console.log("File uploaded");
    //         if (err) {
    //             return res.status(400).send({ error: err.message });
    //         }

    //         const fullPath = path.join('', 'Uploads', req.file.originalname);


    //         console.log('Full path of uploaded file:', fullPath);

    //         res.status(200).json({ Success: true, Message: 'File Uploaded Successfully', Data: "result" });


    //         fileuploadsName = fullPath;


    //     });
    // });




    // router.post("/uploadfile", jsonParser, function (req, res, next) {
    //     upload.single('file')(req, res, function (err) {
    //       console.log("File uploaded");
    //       if (err) {
    //         return res.status(400).send({ error: err.message });
    //       }

    //       // Access modelnew data from req.body
    //       const modelnewData = req.body;
    //       console.log('req.body.EmpName', req.body.EmpName);
    //       const fullPath = path.join('', 'Uploads', req.file.originalname);

    //       console.log('Full path of uploaded file:', fullPath);


    //       const Employee_Closure_FileUpload = datamodel.Employee_Closure_FileUpload();

    //       const dateOfLeaving = req.body.Date_Of_Leaving ? req.body.Date_Of_Leaving : null;
    //       const DateOfDeath = req.body.Date_Of_Death ? req.body.Date_Of_Death : null;

    //       var values = {
    //           EmployeeCode: req.body.EmpCode,
    //           EmployeeName: req.body.EmpName,
    //           Emp_UAN_No: req.body.EmpUAN_No,
    //           Date_Of_Leaving: dateOfLeaving,
    //           Date_Of_Death: DateOfDeath,
    //           UserId: req.body.UserId,
    //           CompId: req.body.CompId,
    //           BranchId: req.body.BranchId,
    //           File_Name: fullPath,
    //           CreatedBy: req.body.UserId,
    //           CreatedDate: connect.sequelize.fn("NOW"),
    //           IsActive: true
    //       };

    //       console.log(values);
    //       dataaccess.Create(Employee_Closure_FileUpload, values)
    //           .then(function (result) {
    //               if (result != null) {
    //               //    res.status(200).json({ Success: true, Message: 'Employee_Closure_FileUpload Details saved successfully', Data: result });
    //               }
    //               else {
    //                   res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //               }
    //           }, function (err) {
    //               dataconn.errorlogger('Emp_Closure_Sevice', 'SaveEmpClosuredetails', err);
    //               res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //           });

    //       res.status(200).json({ Success: true, Message: 'File Uploaded Successfully', Data: modelnewData });

    //       fileuploadsName = fullPath;
    //     });
    //   });







    // router.post("/uploadfile", jsonParser, function (req, res, next) {
    //     upload.single('file')(req, res, function (err) {
    //         console.log("File uploaded");
    //         if (err) {
    //             return res.status(400).send({ error: err.message });
    //         }

    //         // Access modelnew data from req.body
    //         const modelnewData = req.body;
    //         console.log('req.body.EmpName', req.body.EmpName);
    //         const fullPath = path.join('', 'Uploads', req.file.originalname);

    //         console.log('Full path of uploaded file:', fullPath);

    //         // Read the file and convert it to binary data
    //         const fileData = fs.readFileSync(fullPath);
    //         const binaryData = Buffer.from(fileData).toString('base64');

    //         const Employee_Closure_FileUpload = datamodel.Employee_Closure_FileUpload();


    //       const dateOfLeaving = req.body.Date_Of_Leaving ? req.body.Date_Of_Leaving : null;
    //       const DateOfDeath = req.body.Date_Of_Death ? req.body.Date_Of_Death : null;


    //         var values = {
    //             EmployeeCode: req.body.EmpCode,
    //             EmployeeName: req.body.EmpName,
    //             Emp_UAN_No: req.body.EmpUAN_No,
    //             Date_Of_Leaving: dateOfLeaving,
    //             Date_Of_Death: DateOfDeath,
    //             UserId: req.body.UserId,
    //             CompId: req.body.CompId,
    //             BranchId: req.body.BranchId,
    //             File_Name: fullPath,
    //             File_Data: binaryData, // Insert binary data into File_Data column
    //             CreatedBy: req.body.UserId,
    //             CreatedDate: connect.sequelize.fn("NOW"),
    //             IsActive: true
    //         };

    //         console.log(values);
    //         dataaccess.Create(Employee_Closure_FileUpload, values)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     //    res.status(200).json({ Success: true, Message: 'Employee_Closure_FileUpload Details saved successfully', Data: result });
    //                 }
    //                 else {
    //                     //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('Emp_Closure_Sevice', 'SaveEmpClosuredetails', err);
    //                 //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                 console.log(err);
    //             });

    //         res.status(200).json({ Success: true, Message: 'File Uploaded Successfully', Data: modelnewData });

    //         fileuploadsName = fullPath;
    //     });
    // });




    router.post("/uploadfile", jsonParser, function (req, res, next) {
        upload.single('file')(req, res, function (err) {
            console.log("File uploaded");
            if (err) {
                return res.status(400).send({ error: err.message });
            }

            // Access modelnew data from req.body
            const modelnewData = req.body;
            console.log('req.body.EmpName', req.body.EmpName);
            const fullPath = path.join('', 'Uploads', req.file.originalname);

            console.log('Full path of uploaded file:', fullPath);

            // Read the file content as Buffer
            //const fileData = fs.readFileSync(fullPath);

            //const fileData = fs.readFileSync(fullPath);

            const Employee_Closure_FileUpload = datamodel.Employee_Closure_FileUpload();

            const dateOfLeaving = isValidDate(req.body.Date_Of_Leaving) ? new Date(req.body.Date_Of_Leaving) : null;
            const DateOfDeath = isValidDate(req.body.Date_Of_Death) ? new Date(req.body.Date_Of_Death) : null;

            // Function to check if a date string is valid
            function isValidDate(dateString) {
                const dateObject = new Date(dateString);
                return !isNaN(dateObject.getTime());
            }

            function readFileAndConvertToBinary(filePath) {
                try {
                    // Read the file content as Buffer
                    const fileData = fs.readFileSync(filePath);
                    return fileData;
                } catch (error) {
                    console.error('Error reading file:', error);
                    throw error;
                }
            }

            const fileData = readFileAndConvertToBinary(fullPath);

            var values = {
                EmployeeCode: req.body.EmpCode,
                EmployeeName: req.body.EmpName,
                Emp_UAN_No: req.body.EmpUAN_No,
                Date_Of_Leaving: dateOfLeaving,
                Date_Of_Death: DateOfDeath,
                UserId: req.body.UserId,
                CompId: req.body.CompId,
                BranchId: req.body.BranchId,
                File_Name: fullPath,
                File_Data: fileData, // Insert binary data into File_Data column
                CreatedBy: req.body.CreatedBy,
                CreatedDate: connect.sequelize.fn("NOW"),
                IsActive: true
            };

            console.log('Model.....',values);
            // dataaccess.Create(Employee_Closure_FileUpload, values)
            //     .then(function (result) {
            //         if (result != null) {
            //             // Handle success, if needed
            //             console.log('Success');

            //         } else {
            //             // Handle failure, if needed
            //         }
            //     })
            //     .catch(function (err) {
            //         dataconn.errorlogger('Emp_Closure_Sevice', 'SaveEmpClosuredetails', err);
            //         console.log(err);
            //     })
            //     .finally(function () {
            //         // Always send the response after the database operation
            //         res.status(200).json({ Success: true, Message: 'File Uploaded Successfully', Data: modelnewData });
            //     });


            Employee_Closure_FileUpload.create({
                EmployeeCode: req.body.EmployeeCode,
                EmployeeName: req.body.EmployeeName,
                Emp_UAN_No: req.body.EmpUAN_No,
                Date_Of_Leaving: dateOfLeaving,
                Date_Of_Death: DateOfDeath,
                UserId: req.body.UserId,
                CompId: req.body.CompId,
                BranchId: req.body.BranchId,
                File_Name: fullPath,
                File_Data: fileData,
                CreatedBy: req.body.UserId,
                CreatedDate: new Date(),
                IsActive: true
            })
                .then(result => {
                    // Handle success
                    console.log('Record inserted successfully:', result);
                })
                .catch(error => {
                    // Handle failure
                    console.error('Error inserting record:', error);
                });

            fileuploadsName = fullPath;
        });
    });


    //EmpCode,EmpName,EmpUAN_No,Fathers_Husbend_Name,Date_Of_Leaving,Date_Of_Death,Reason

    router.route('/SaveEmpClosuredetails')
        .post(function (req, res) {

            const Employee_Closure_Master = datamodel.Employee_Closure_Master();

            const dateOfLeaving = req.body.Date_Of_Leaving ? req.body.Date_Of_Leaving : null;
            const DateOfDeath = req.body.Date_Of_Death ? req.body.Date_Of_Death : null;

            var values = {
                EmployeeCode: req.body.EmpCode,
                EmployeeName: req.body.EmpName,
                Emp_UAN_No: req.body.EmpUAN_No,
                Fathers_Husbend_Name: req.body.Fathers_Husbend_Name,
                Date_Of_Leaving: dateOfLeaving,
                Date_Of_Death: DateOfDeath,
                Reason: req.body.Reason,
                UserId: req.body.UserId,
                CompId: req.body.CompId,
                BranchId: req.body.BranchId,
                CreatedBy: req.body.CreatedBy,
                CreatedDate: connect.sequelize.fn("NOW"),
                IsActive: true

            };

            console.log(values);
            dataaccess.Create(Employee_Closure_Master, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Employee_Closure_Master Details saved successfully', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Emp_Closure_Sevice', 'SaveEmpClosuredetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });


    router.route('/GetAllEmployeeClosure')
        .get(function (req, res) {
            const Employee_Closure_Master = datamodel.Employee_Closure_Master();

            var param = {
                attributes: ['Id', 'EmployeeCode', 'EmployeeName', 'Emp_UAN_No', 'Fathers_Husbend_Name', 'Date_Of_Leaving', 'Date_Of_Death', 'Reason'
                    , 'IsActive', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
                order: [['Id', 'DESC']],
                where: {
                    IsActive: true
                }
            };

            dataaccess.FindAll(Employee_Closure_Master, param)
                .then(function (result) {
                    if (result != null) {
                        //          console.log(result);
                        res.status(200).json({ Success: true, Message: 'get Employee_Closure_Master details Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of get Employee_Closure_Master details', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Emp_Closure_Sevice', 'SaveEmpClosuredetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Employee_Closure_Master Table', Data: null });
                });

        });

        


        router.route('/getallEmployeepfdetails')
        .get(function (req, res) {

            const EmployeePFDetail = datamodel.EmployeePFDetail();
            var param = {
                where: {  Prev_UAN: {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.not]: ''
                    }
                } }, attributes: ['Id', 'PFDataId', 'CompanyId', 'BranchId', 'UserId', 'PersonalTitle', 'Srno', 'EmpCode', 'Prev_PFNumber', 
                'Prev_UAN', 'PFWages', 'PFnPensionWithdraw', 'WithdrawlDate', 'DateOFLeaving', 'PresentPFNo', 
                'EmpName', 'FatherName', 'HusbandName', 'Father_Husbend_Name','MartialStatus', 'Gender', 'DateOfBirth', 'DateOfJoining', 
                'PanNo', 'NameAsPerPan', 'NameAsPerPassport', 'RelationShip', 'MonthlySalary', 'Country', 'Nationality',
                 'AdharNo', 'NameAsPerAdhar', 'NameOfBank', 'BankBranch', 'BankAccNo', 'BankIFSCCode', 'IsNamePrintedOnCheque', 
                 'EduQual', 'Handicapped', 'TypeOFHandicap', 'IsInternationalWorker', 'Remarks', 'MobileNo', 'Emailid', 
                 'Status', 'DataFeed', 'SortingFlag', 'PassportNumber', 'PassportFromDate', 'PassportValidToDate', 
                 'IsActive', 'CreatedOn', 'ModifiedOn', 'CreatedBy', 'ModifiedBy'],
                 
                order: [['ModifiedOn', 'DESC']],
            }


            // console.log("inside create", values)
            dataaccess.FindAll(EmployeePFDetail, param)
                .then(function (result) {
                    if (result != null) {
                        // console.log("asdfghjkkl", result);
                        res.status(200).json({ Success: true, Message: 'Employee details successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while Employee details', Data: result });
                    }
                }
                    ,
                    function (err) {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
                    }
                );
        });


        
    router.route('/downloadbyId/:Emp_UAN_No')
    .get(function (req, res) {

        const Employee_Closure_FileUpload = datamodel.Employee_Closure_FileUpload();
        var param = { where: { Emp_UAN_No: req.params.Emp_UAN_No } };

        dataaccess.FindOne(Employee_Closure_FileUpload, param)
            .then(function (result) {
                if (result != null) {
                    res.status(200).json({ Success: true, Message: 'Employee_Closure_FileUpload Data', Data: result });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Employee_Closure_FileUpload Table', Data: null });
                }
            }, function (err) {
                dataconn.errorlogger('Emp_Closure_Sevice', 'downloadbyId', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of Employee_Closure_FileUpload Table', Data: null });
            });

    });




    router.route('/GetEmpClosureId/:Id')
        .get(function (req, res) {

            const Employee_Closure_Master = datamodel.Employee_Closure_Master();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(Employee_Closure_Master, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Employee_Closure_Master Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Employee_Closure_Master Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Emp_Closure_Sevice', 'GetEmpClosureId', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Employee_Closure_Master Table', Data: null });
                });

        });




    router.route('/UpdateEmployeeClosure')
        .post(function (req, res) {

            const Employee_Closure_Master = datamodel.Employee_Closure_Master();

            const dateOfLeaving = req.body.Date_Of_Leaving ? req.body.Date_Of_Leaving : null;
            const DateOfDeath = req.body.Date_Of_Death ? req.body.Date_Of_Death : null;


            var values = {
                EmployeeCode: req.body.EmpCode,
                EmployeeName: req.body.EmpName,
                Emp_UAN_No: req.body.EmpUAN_No,
                Fathers_Husbend_Name: req.body.Fathers_Husbend_Name,
                Date_Of_Leaving: dateOfLeaving,
                Date_Of_Death: DateOfDeath,
                Reason: req.body.Reason,
                UserId: req.body.UserId,
                CompId: req.body.CompId,
                BranchId: req.body.BranchId,
                IsActive: req.body.IsActive,
                ModifiedBy: req.body.ModifiedBy,
                ModifiedOn: connect.sequelize.fn("NOW"),

            };
            var param = { Id: req.body.EMPClosureId };
            dataaccess.Update(Employee_Closure_Master, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Employee_Closure_Master updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('Emp_Closure_Sevice', 'Employee_Closure_Master', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Emp_Closure_Sevice', 'Employee_Closure_Master', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });


    return router;

};

module.exports = routes;