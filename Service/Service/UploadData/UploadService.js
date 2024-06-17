var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var multer = require("multer");
const path = require('path');
var upload = multer();
const fse = require("fs-extra");
const fs = require("fs");
const config = require('../../Config');
var moment = require("moment");

var routes = function () {

    
    router.route('/GetAllUsersName')
        .get(function (req, res) {
            const UserMst = datamodel.UserMst();

            var param = {
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('EmpName')), 'EmpName'],
                ],
            };

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'UserMst Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of UserMst Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UploadService', 'GetAllUsersName', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of UserMst Table', Data: null });
                });

        });



    // UAN_Number,PF_Number,Name,Date_Of_Birth,Date_Of_Joining,Gender,Fathers_Husbend_Name,RelationShip_With_Member,MobileNo,EmailId,Nationality,
    // Wages_Of_Joining,Qualification,MartialStatus,InternationalWorker,Country_Of_Origin,PassportNumber,PassportValidFromDate,
    // PassportValidToDate,IsPhysically_Handicapped,Locomotive,Hearing,Visual,Pan,NameAsPerPan,AdharNo,NameAsOnAdhar,
    // Remarks,Date,


    // router.route('/SaveNewEmployeeDataUpload')
    //     .post(function (req, res) {

    //         const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();

    //         //            var querytext = 'SELECT "NewEmployeePFDetail_Upload"(:UAN_Number,:PF_Number,:pName,:DateOfBirth,:Gender,:Fathers_Husbend_Name,:RelationShip_With_Member,:MobileNo,:EmailId,:Nationality,:Wages_Of_Joining,:Qualification,:MartialStatus,:InternationalWorker,:Country_Of_Origin,:PassportNumber,:PassportValidFromDate,:PassportValidToDate,:IsPhysically_Handicapped,:Locomotive,:Hearing,:Visual,:Pan,:NameAsPerPan,:AdharNo,:NameAsOnAdhar,:Remarks,:pDate,:Status,:CreatedBy,:UserName,:p_ref); FETCH ALL IN "abc"';

    //         var List2 = [];

    //         let mapDetails = [];
    //         //    console.log("mapitem at index 14:", req.body.tabledata);

    //         let values = [];

    //         req.body.tabledata.forEach(mapitem => {
    //             //     console.log("......",mapitem)


    //             values.push({
    //                 uan_number: mapitem.UAN_Number,
    //                 pf_number: mapitem.PF_Number,
    //                 pname: mapitem.Name,
    //                 dateofbirth: mapitem.Date_Of_Birth,
    //                 date_of_joining: mapitem.Date_Of_Joining,
    //                 gender: mapitem.Gender,
    //                 fathers_husbend_name: mapitem.Fathers_Husbend_Name,
    //                 relationship_with_member: mapitem.RelationShip_With_Member,
    //                 mobileno: mapitem.MobileNo,
    //                 emailid: mapitem.EmailId,
    //                 nationality: mapitem.Nationality,
    //                 wages_of_joining: mapitem.Wages_Of_Joining,
    //                 qualification: mapitem.Qualification,
    //                 martialstatus: mapitem.MartialStatus,
    //                 internationalworker: mapitem.InternationalWorker,
    //                 country_of_origin: mapitem.Country_Of_Origin,
    //                 passportnumber: mapitem.PassportNumber,
    //                 passportvalidfromdate: mapitem.PassportValidFromDate,
    //                 passportvalidtodate: mapitem.PassportValidToDate,
    //                 isphysically_handicapped: mapitem.IsPhysically_Handicapped,
    //                 locomotive: mapitem.Locomotive,
    //                 hearing: mapitem.Hearing,
    //                 visual: mapitem.Visual,
    //                 pan: mapitem.Pan,
    //                 nameasperpan: mapitem.NameAsPerPan,
    //                 adharno: mapitem.AdharNo,
    //                 nameasonadhar: mapitem.NameAsOnAdhar,
    //                 remarks: '',
    //                 pdate: mapitem.UploadDate,
    //                 // BatchId: mapitem.BatchId,
    //                 status: 'Draft',
    //                 createdby: mapitem.userid,
    //                 // CreatedDate: connect.sequelize.fn("NOW"),
    //                 username: mapitem.UserName,
    //                 p_ref: 'abc',
    //             });
    //             // List2.push(values)
    //         });
    //         // console.log("List......",mapDetails[0])


    //         // console.log("List......",values)

    //         dataaccess.BulkCreate(NewEmployeePFDetail_Upload, mapDetails).then(
    //             (resultfinal1) => {
    //                 console.log("result2: ", resultfinal1[0]);
    //                 if (resultfinal1 != "") {
    //                     res.status(200).json({ Success: true, Message: ' NewEmployeePFDetail_Upload saved successfully', Data: resultfinal1 });
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload files', Data: err1 });
    //                 }
    //             }).catch((err1) => {
    //                 console.log('err1', err1);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload', Data: err1 });
    //             })
    //     });




    //ok code
    // router.route('/SaveNewEmployeeDataUpload')
    //     .post(function (req, res) {

    //         const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();

    //         var List2 = [];

    //         let mapDetails = [];

    //         req.body.tabledata.forEach(mapitem => {
    //             //  console.log("......",mapitem)
    //             mapDetails.push({
    //                 UAN_Number: mapitem.UAN_Number,
    //                 PF_Number: mapitem.PF_Number,
    //                 Name: mapitem.Name,
    //                 Date_Of_Birth: mapitem.Date_Of_Birth,
    //                 Date_Of_Joining: mapitem.Date_Of_Joining,
    //                 Gender: mapitem.Gender,
    //                 Fathers_Husbend_Name: mapitem.Fathers_Husbend_Name,
    //                 RelationShip_With_Member: mapitem.RelationShip_With_Member,
    //                 MobileNo: mapitem.MobileNo,
    //                 EmailId: mapitem.EmailId,
    //                 Nationality: mapitem.Nationality,
    //                 Wages_Of_Joining: mapitem.Wages_Of_Joining,
    //                 Qualification: mapitem.Qualification,
    //                 MartialStatus: mapitem.MartialStatus,
    //                 InternationalWorker: mapitem.InternationalWorker,
    //                 Country_Of_Origin: mapitem.Country_Of_Origin,
    //                 PassportNumber: mapitem.PassportNumber,
    //                 PassportValidFromDate: mapitem.PassportValidFromDate,
    //                 PassportValidToDate: mapitem.PassportValidToDate,
    //                 IsPhysically_Handicapped: mapitem.IsPhysically_Handicapped,
    //                 Locomotive: mapitem.Locomotive,
    //                 Hearing: mapitem.Hearing,
    //                 Visual: mapitem.Visual,
    //                 Pan: mapitem.Pan,
    //                 NameAsPerPan: mapitem.NameAsPerPan,
    //                 AdharNo: mapitem.AdharNo,
    //                 NameAsOnAdhar: mapitem.NameAsOnAdhar,
    //                 Date: mapitem.UploadDate,
    //                 BatchId: mapitem.BatchId,
    //                 Status: 'Draft',
    //                 CreatedBy: mapitem.userid,
    //                 CreatedDate: connect.sequelize.fn("NOW"),
    //                 UserName: mapitem.UserName,
    //                 CompId: mapitem.CompId,
    //                 BranchId: mapitem.BranchId
    //             });
    //             // List2.push(values)
    //         });
    //         // console.log("List......",mapDetails[0])
    //         dataaccess.BulkCreate(NewEmployeePFDetail_Upload, mapDetails).then(
    //             (resultfinal1) => {
    //                 console.log("result2: ", resultfinal1[0]);
    //                 if (resultfinal1 != "") {

    //                     var querytext = 'SELECT "Insert_NewEmployeePF_Data_Validations"(:uan_number,:pf_number,:createdby,:p_ref); FETCH ALL IN "abc"';
    //                     var param = {
    //                         replacements: {
    //                             uan_number: '',
    //                             pf_number: '',
    //                             createdby: 1,
    //                             p_ref: 'abc'
    //                         },
    //                         type: connect.sequelize.QueryTypes.SELECT
    //                     }

    //                     connect.sequelize
    //                         .query(querytext, param)
    //                         .then(function (result) {
    //                             //       console.log("result", result);
    //                             result.shift();
    //                             res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
    //                         }, function (err) {
    //                             dataconn.errorlogger('UploadService', 'NewEmployeePFDetail_Upload', err);
    //                             res.status(200).json({ Success: false, Message: 'User has no access of Report', Data: null });
    //                             console.log("result", err);
    //                         });
    //                     // res.status(200).json({ Success: true, Message: ' NewEmployeePFDetail_Upload saved successfully', Data: resultfinal1 });
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload files', Data: err1 });
    //                 }
    //             }).catch((err1) => {
    //                 console.log('err1', err1);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload', Data: err1 });
    //             })
    //     });



//15-dec-23 changes for delete overight old code backup
    // router.route('/SaveNewEmployeeDataUpload')
    //     .post(function (req, res) {

    //         const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();

    //         var List2 = [];

    //         let mapDetails = [];

    //         req.body.tabledata.forEach(mapitem => {
    //             //  console.log("......",mapitem)
    //             mapDetails.push({
    //                 UAN_Number: mapitem.UAN_Number,
    //                 PF_Number: mapitem.PF_Number,
    //                 Name: mapitem.Name,
    //                 Date_Of_Birth: mapitem.Date_Of_Birth,
    //                 Date_Of_Joining: mapitem.Date_Of_Joining,
    //                 Gender: mapitem.Gender,
    //                 Fathers_Husbend_Name: mapitem.Fathers_Husbend_Name,
    //                 RelationShip_With_Member: mapitem.RelationShip_With_Member,
    //                 MobileNo: mapitem.MobileNo,
    //                 EmailId: mapitem.EmailId,
    //                 Nationality: mapitem.Nationality,
    //                 Wages_Of_Joining: mapitem.Wages_Of_Joining,
    //                 Qualification: mapitem.Qualification,
    //                 MartialStatus: mapitem.MartialStatus,
    //                 InternationalWorker: mapitem.InternationalWorker,
    //                 Country_Of_Origin: mapitem.Country_Of_Origin,
    //                 PassportNumber: mapitem.PassportNumber,
    //                 PassportValidFromDate: mapitem.PassportValidFromDate,
    //                 PassportValidToDate: mapitem.PassportValidToDate,
    //                 IsPhysically_Handicapped: mapitem.IsPhysically_Handicapped,
    //                 Locomotive: mapitem.Locomotive,
    //                 Hearing: mapitem.Hearing,
    //                 Visual: mapitem.Visual,
    //                 Pan: mapitem.Pan,
    //                 NameAsPerPan: mapitem.NameAsPerPan,
    //                 AdharNo: mapitem.AdharNo,
    //                 NameAsOnAdhar: mapitem.NameAsOnAdhar,
    //                 Date: mapitem.UploadDate,
    //                 BatchId: mapitem.BatchId,
    //                 Status: 'Draft',
    //                 CreatedBy: mapitem.userid,
    //                 CreatedDate: connect.sequelize.fn("NOW"),
    //        //         UserName: mapitem.UserName,
    //                 CompId: req.body.CompId,
    //                 BranchId: req.body.BranchId,
    //                 UserId: req.body.userId
    //             });
    //             // List2.push(values)
    //         });


    //         const uanNumbersToDelete = mapDetails.map(item => item.UAN_Number);

    //         console.log('delete uan', uanNumbersToDelete);
    //         // Delete existing records with matching UAN numbers
    //         NewEmployeePFDetail_Upload.destroy({
    //             where: {
    //                 UAN_Number: {
    //                     [Sequelize.Op.in]: uanNumbersToDelete.map(String) // Convert to string explicitly
    //                 },
    //                 Status: 'Draft'
    //             }
    //         })
            
    //             .then(() => {
    //                 // After deletion, insert new records
    //                 return NewEmployeePFDetail_Upload.bulkCreate(mapDetails);
    //             })
    //             .then((resultfinal1) => {
    //                 console.log("result2: ", resultfinal1[0]);

    //                 if (resultfinal1 != "") {

    //                     var querytext = 'SELECT "Insert_NewEmployeePF_Data_Validations"(:uan_number,:pf_number,:createdby,:p_ref); FETCH ALL IN "abc"';
    //                     var param = {
    //                         replacements: {
    //                             uan_number: '',
    //                             pf_number: '',
    //                             createdby: req.body.userId,
    //                             p_ref: 'abc'
    //                         },
    //                         type: connect.sequelize.QueryTypes.SELECT
    //                     }

    //                     connect.sequelize
    //                         .query(querytext, param)
    //                         .then(function (result) {
    //                             //       console.log("result", result);
    //                             result.shift();
    //                             res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
    //                         }, function (err) {
    //                             dataconn.errorlogger('UploadService', 'NewEmployeePFDetail_Upload', err);
    //                             res.status(200).json({ Success: false, Message: 'User has no access of Report', Data: null });
    //                             console.log("result", err);
    //                         });
    //                     // res.status(200).json({ Success: true, Message: ' NewEmployeePFDetail_Upload saved successfully', Data: resultfinal1 });
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload files', Data: err1 });
    //                 }
    //             }).catch((err1) => {
    //                 console.log('err1', err1);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload', Data: err1 });
    //             })
    //     });

//old code backup end




router.route('/SaveNewEmployeeDataUpload')
.post(function (req, res) {

    const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();

    var List2 = [];

    let mapDetails = [];

    req.body.tabledata.forEach(mapitem => {
        //  console.log("......",mapitem)
        mapDetails.push({
            UAN_Number: mapitem.UAN_Number,
            PF_Number: mapitem.PF_Number,
            Name: mapitem.Name,
            Date_Of_Birth: mapitem.Date_Of_Birth,
            Date_Of_Joining: mapitem.Date_Of_Joining,
            Gender: mapitem.Gender,
            Fathers_Husbend_Name: mapitem.Fathers_Husbend_Name,
            RelationShip_With_Member: mapitem.RelationShip_With_Member,
            MobileNo: mapitem.MobileNo,
            EmailId: mapitem.EmailId,
            Nationality: mapitem.Nationality,
            Wages_Of_Joining: mapitem.Wages_Of_Joining,
            Qualification: mapitem.Qualification,
            MartialStatus: mapitem.MartialStatus,
            InternationalWorker: mapitem.InternationalWorker,
            Country_Of_Origin: mapitem.Country_Of_Origin,
            PassportNumber: mapitem.PassportNumber,
            PassportValidFromDate: mapitem.PassportValidFromDate,
            PassportValidToDate: mapitem.PassportValidToDate,
            IsPhysically_Handicapped: mapitem.IsPhysically_Handicapped,
            Locomotive: mapitem.Locomotive,
            Hearing: mapitem.Hearing,
            Visual: mapitem.Visual,
            Pan: mapitem.Pan,
            NameAsPerPan: mapitem.NameAsPerPan,
            AdharNo: mapitem.AdharNo,
            NameAsOnAdhar: mapitem.NameAsOnAdhar,
            Date: mapitem.UploadDate,
            BatchId: mapitem.BatchId,
            Status: 'Draft',
            CreatedBy: mapitem.userid,
            CreatedDate: connect.sequelize.fn("NOW"),
   //         UserName: mapitem.UserName,
            CompId: req.body.CompId,
            BranchId: req.body.BranchId,
            UserId: req.body.userId
        });
        // List2.push(values)
    });


    const uanNumbersToDelete = mapDetails.map(item => item.UAN_Number);

    const compIdsToDelete = mapDetails.map(item => item.CompId);
    const branchIdsToDelete = mapDetails.map(item => item.BranchId);
    
    console.log('delete compIds', compIdsToDelete);
    console.log('delete branchIds', branchIdsToDelete);

    
    console.log('delete uan', uanNumbersToDelete);
    // Delete existing records with matching UAN numbers
    // NewEmployeePFDetail_Upload.destroy({
    //     where: {
    //         UAN_Number: {
    //             [Sequelize.Op.in]: uanNumbersToDelete.map(String) // Convert to string explicitly
    //         },
    //         Status: 'Draft'
    //     }
    // })
    
    NewEmployeePFDetail_Upload.destroy({
        where: {
            CompId: {
                [Sequelize.Op.in]: compIdsToDelete.map(String)
            },
            BranchId: {
                [Sequelize.Op.in]: branchIdsToDelete.map(String)
            },
            Status: 'Draft'
        }
    })

        .then(() => {
            // After deletion, insert new records
            return NewEmployeePFDetail_Upload.bulkCreate(mapDetails);
        })
        .then((resultfinal1) => {
            console.log("result2: ", resultfinal1[0]);

            if (resultfinal1 != "") {

                var querytext = 'SELECT "Insert_NewEmployeePF_Data_Validations"(:uan_number,:pf_number,:createdby,:p_ref); FETCH ALL IN "abc"';
                var param = {
                    replacements: {
                        uan_number: '',
                        pf_number: '',
                        createdby: req.body.userId,
                        p_ref: 'abc'
                    },
                    type: connect.sequelize.QueryTypes.SELECT
                }

                connect.sequelize
                    .query(querytext, param)
                    .then(function (result) {
                        //       console.log("result", result);
                        result.shift();
                        res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
                    }, function (err) {
                        dataconn.errorlogger('UploadService', 'NewEmployeePFDetail_Upload', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of Report', Data: null });
                        console.log("result", err);
                    });
                // res.status(200).json({ Success: true, Message: ' NewEmployeePFDetail_Upload saved successfully', Data: resultfinal1 });
            }
            else {
                res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload files', Data: err1 });
            }
        }).catch((err1) => {
            console.log('err1', err1);
            res.status(200).json({ Success: false, Message: 'Error occurred while uploading NewEmployeePFDetail_Upload', Data: err1 });
        })
});


    // router.route('/SaveNewEmployeeDataUpload')
    //     .post(async function (req, res) {


    //         const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();

    //         var List2 = [];

    //         let mapDetails = [];

    //         req.body.tabledata.forEach(mapitem => {
    //             //  console.log("......",mapitem)
    //             mapDetails.push({
    //                 UAN_Number: mapitem.UAN_Number,
    //                 PF_Number: mapitem.PF_Number,
    //                 Name: mapitem.Name,
    //                 Date_Of_Birth: mapitem.Date_Of_Birth,
    //                 Date_Of_Joining: mapitem.Date_Of_Joining,
    //                 Gender: mapitem.Gender,
    //                 Fathers_Husbend_Name: mapitem.Fathers_Husbend_Name,
    //                 RelationShip_With_Member: mapitem.RelationShip_With_Member,
    //                 MobileNo: mapitem.MobileNo,
    //                 EmailId: mapitem.EmailId,
    //                 Nationality: mapitem.Nationality,
    //                 Wages_Of_Joining: mapitem.Wages_Of_Joining,
    //                 Qualification: mapitem.Qualification,
    //                 MartialStatus: mapitem.MartialStatus,
    //                 InternationalWorker: mapitem.InternationalWorker,
    //                 Country_Of_Origin: mapitem.Country_Of_Origin,
    //                 PassportNumber: mapitem.PassportNumber,
    //                 PassportValidFromDate: mapitem.PassportValidFromDate,
    //                 PassportValidToDate: mapitem.PassportValidToDate,
    //                 IsPhysically_Handicapped: mapitem.IsPhysically_Handicapped,
    //                 Locomotive: mapitem.Locomotive,
    //                 Hearing: mapitem.Hearing,
    //                 Visual: mapitem.Visual,
    //                 Pan: mapitem.Pan,
    //                 NameAsPerPan: mapitem.NameAsPerPan,
    //                 AdharNo: mapitem.AdharNo,
    //                 NameAsOnAdhar: mapitem.NameAsOnAdhar,
    //                 Date: mapitem.UploadDate,
    //                 BatchId: mapitem.BatchId,
    //                 Status: 'Draft',
    //                 CreatedBy: mapitem.userid,
    //                 CreatedDate: connect.sequelize.fn("NOW"),
    //                 UserName: mapitem.UserName,
    //                 CompId: mapitem.CompId,
    //                 BranchId: mapitem.BranchId
    //             });
    //             // List2.push(values)
    //         });
    //         // console.log("List......",mapDetails[0])

    //         const existingUANNumbers = mapDetails.map(item => item.UAN_Number);
    //         const existingUANNumbersAsString = existingUANNumbers.map(String);

    //         try {
    //             // Fetch existing records
    //             const existingRecords = await NewEmployeePFDetail_Upload.findAll({
    //                 where: { UAN_Number: existingUANNumbersAsString },
    //             });

    //             const existingUANs = existingRecords.map(record => record.UAN_Number);

    //             // Separate new and existing records
    //             const newRecords = mapDetails.filter(item => !existingUANs.includes(item.UAN_Number));
    //             const existingRecordsToUpdate = mapDetails.filter(item => existingUANs.includes(item.UAN_Number));

    //             // Insert new records
    //             const newRecordsResult = await dataaccess.BulkCreate(NewEmployeePFDetail_Upload, newRecords);

    //             // Update existing records
    //             for (const existingRecord of existingRecordsToUpdate) {
    //                 const { UAN_Number, ...updatedValues } = existingRecord;
    //                 await NewEmployeePFDetail_Upload.update(updatedValues, {
    //                     where: { UAN_Number: UAN_Number },
    //                 });
    //             }

    //             // Respond with success message
    //             res.status(200).json({
    //                 Success: true,
    //                 Message: 'Records inserted and updated successfully',
    //                 Data: { newRecords: newRecordsResult, existingRecords: existingRecordsToUpdate },
    //             });
    //         } catch (error) {
    //             // Handle errors and respond with an error message
    //             console.error('Error:', error);
    //             res.status(500).json({ Success: false, Message: 'Error processing records', Data: null });
    //         }
    //     });


    router.route('/SubmitDataUpload')
        .post(function (req, res) {

            // var querytext = 'SELECT "SubmitDataUpload"(:uan_number,:pf_number,:createdby,:p_ref); FETCH ALL IN "abc"';

            var querytext = 'SELECT "SubmitDataUpload_New"(:uan_number,:pf_number,:createdby,:p_ref); FETCH ALL IN "abc"';

            
            var param = {
                replacements: {
                    uan_number: '',
                    pf_number: '',
                    createdby: 1,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    //       console.log("result", result);
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('UploadService', 'SubmitDataUpload', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Report', Data: null });
                    console.log("result", err);
                });
        });


    router.route('/GetAllEmployeeDetails')
        .post(function (req, res) {
            const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();


            var param = {
                attributes: ['Id', 'UAN_Number', 'PF_Number', 'Name', 'Date_Of_Birth', 'Date_Of_Joining', 'Gender', 'Fathers_Husbend_Name',
                    'RelationShip_With_Member', 'MobileNo', 'EmailId', 'Nationality', 'Wages_Of_Joining', 'Qualification', 'MartialStatus',
                    'InternationalWorker', 'Country_Of_Origin', 'PassportNumber', 'PassportValidFromDate', 'PassportValidToDate', 'IsPhysically_Handicapped',
                    'Locomotive', 'Hearing', 'Visual', 'Pan', 'NameAsPerPan', 'AdharNo', 'NameAsOnAdhar', 'Remarks', 'Date', 'BatchId', 'Status', 'UserName'],

                where: {
                    CreatedBy: req.body.p_userid,
                    Status: 'Draft'
                },
                order: [['Remarks', 'ASC']],
            };


            // var param = {
            //     attributes: ['Id', 'UAN_Number', 'PF_Number', 'Name', 'Date_Of_Birth', 'Date_Of_Joining', 'Gender', 'Fathers_Husbend_Name',
            //       'RelationShip_With_Member', 'MobileNo', 'EmailId', 'Nationality', 'Wages_Of_Joining', 'Qualification', 'MartialStatus',
            //       'InternationalWorker', 'Country_Of_Origin', 'PassportNumber', 'PassportValidFromDate', 'PassportValidToDate', 'IsPhysically_Handicapped',
            //       'Locomotive', 'Hearing', 'Visual', 'Pan', 'NameAsPerPan', 'AdharNo', 'NameAsOnAdhar', 'Remarks', 'Date', 'BatchId', 'Status'
            //     ],
            //     where: {
            //       // Add your conditions here
            //       // Example: Status should be 'Active'
            //       Status: 'Active'
            //     }
            //   };

            dataaccess.FindAll(NewEmployeePFDetail_Upload, param)
                .then(function (result) {
                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'NewEmployeePFDetail_Upload Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of NewEmployeePFDetail_Upload Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UploadService', 'GetAllEmployeeDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of NewEmployeePFDetail_Upload Table', Data: null });
                });

        });


    router.route('/Get_SchemeName')
        .post(function (req, res) {

            var querytext = 'SELECT "SchemeName"(:p_ref); FETCH ALL IN "abc"';
            var param = {
                replacements: {
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    //       console.log("result", result);
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('ReportService', 'Get_AIFTradeReport', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Report', Data: null });
                    console.log("result", err);
                });
        });


    router.route('/GetMaxId')
        .get(function (req, res) {
            const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();

            dataaccess.FindOne(NewEmployeePFDetail_Upload, {
                attributes: [
                    [connect.sequelize.fn('MAX', connect.sequelize.col('BatchId')), 'BatchId']
                ]
            })
                .then(function (result) {
                    const maxId = result.BatchId;

                    res.status(200).json({ Success: true, Message: 'Max Id from NewEmployeePFDetail_Upload', Data: { maxId } });
                })
                .catch(function (err) {
                    dataconn.errorlogger('UploadService', 'GetMaxId', err);
                    res.status(500).json({ Success: false, Message: 'Error retrieving Max Id', Data: null });
                });
        });



    return router;

};

module.exports = routes;