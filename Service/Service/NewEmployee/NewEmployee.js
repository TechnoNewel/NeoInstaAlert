var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');


var routes = function () {

    router.route('/getallEmployeepfdetails')
        .get(function (req, res) {

            const EmployeePFDetail = datamodel.EmployeePFDetail();
            var param = {
                where: { IsActive: true }, attributes: ['Id','MartialStatus', 'EmpName', 'EmpCode', 'Handicapped',
                    'DateOfJoining', 'DateOfBirth', 'PFWages', 'Emailid', 'IsInternationalWorker', 'MobileNo', 'PanNo',
                    'NameAsPerPan', 'AdharNo', 'NameAsPerAdhar', 'EduQual', 'Gender']
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

    

    router.route('/CreateEmployeeForm')
        .post(function (req, res) {

            const EmployeePFDetail = datamodel.EmployeePFDetail();

            var values = {
              
                MartialStatus: req.body.MartialStatus.toString().trim(),
                Gender: req.body.Gender.toString().trim(),
                EmpName: req.body.EmpName.toString().trim(),
                EmpCode: req.body.EmpCode.toString().trim(),
                Handicapped: req.body.Handicapped.toString().trim(),
                DateOfJoining: req.body.DateOfJoining,
                DateOfBirth: req.body.DateOfBirth,
                PFWages: req.body.PFWages,
                Emailid: req.body.Emailid.toString().trim(),
                IsInternationalWorker: req.body.IsInternationalWorker.toString().trim(),
                MobileNo: req.body.MobileNo,
                PanNo: req.body.PanNo.toString().trim(),
                NameAsPerPan: req.body.NameAsPerPan.toString().trim(),
                AdharNo: req.body.AdharNo,
                NameAsPerAdhar: req.body.NameAsPerAdhar.toString().trim(),
                EduQual: req.body.EduQual.toString().trim(),
                IsActive: true

            };
            // console.log("inside create", values)
            dataaccess.Create(EmployeePFDetail, values)
                .then(function (result) {
                    if (result != null) {
                        // console.log("asdfghjkkl", result);
                        res.status(200).json({ Success: true, Message: 'Asset saved successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: result });
                    }
                }
                    ,
                    function (err) {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
                    }
                );
        });

    // update-start
    router.route('/UpdateEmployeeForm')
        .post(function (req, res) {
            const EmployeePFDetail = datamodel.EmployeePFDetail();

            var values = {
                MartialStatus: req.body.MartialStatus.toString().trim(),
                Gender: req.body.Gender.toString().trim(),
                EmpName: req.body.EmpName.toString().trim(),
                EmpCode: req.body.EmpCode.toString().trim(),
                Handicapped: req.body.Handicapped.toString().trim(),
                DateOfJoining: req.body.DateOfJoining,
                DateOfBirth: req.body.DateOfBirth,
                PFWages: req.body.PFWages,
                Emailid: req.body.Emailid.toString().trim(),
                IsInternationalWorker: req.body.IsInternationalWorker.toString().trim(),
                MobileNo:req.body.MobileNo,
                PanNo: req.body.PanNo.toString().trim(),
                NameAsPerPan: req.body.NameAsPerPan.toString().trim(),
                AdharNo: req.body.AdharNo,
                NameAsPerAdhar: req.body.NameAsPerAdhar.toString().trim(),
                EduQual: req.body.EduQual.toString().trim(),
                IsActive: true
            };

            // Assuming you have a parameter :id in the route to specify the record to update
            var param = { Id:req.body.Id};

            // Update the record with the new values
            dataaccess.Update(EmployeePFDetail, values, param)
                .then(function (result) {
                    if (result != null) {
                        console.log("Record updated successfully", result);
                        res.status(200).json({ Success: true, Message: 'Record updated successfully', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: result });
                    }
                },
                    function (err) {
                        console.error("Error occurred while updating record", err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: err, values });
                    });
        });

    // router.route('/GetEmployeedataById')
    //     .post(function (req, res) {
    //         const EmployeePFDetail = datamodel.EmployeePFDetail();
    //         var param = {
    //             where: { EmpCode: req.body.EmpCode }
    //         }
    //         dataaccess.FindAll(EmployeePFDetail, param)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     // console.log("asdfghjkkl", result);
    //                     res.status(200).json({ Success: true, Message: 'Employee details by ID successfully', Data: result });
    //                 }
    //                 else {

    //                     res.status(200).json({ Success: false, Message: 'Error occurred while Employee details', Data: result });
    //                 }
    //             }
    //                 ,
    //                 function (err) {

    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
    //                 }
    //             );

    //     });


    router.route('/DeleteEmployeeDetails')

        .post(function (req, res) {

            const EmployeePFDetail = datamodel.EmployeePFDetail();


            var param = { Id: req.body.Id, IsActive: true };

            //   console.log("params",param)

            dataaccess.Delete(EmployeePFDetail, param)
                .then(function (result) {
                    // console.log("Record deleted successfully", result);
                    if (result != null && result > 0) {

                        res.status(200).json({ Success: true, Message: 'Employee details deleted successfully', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'No employee details found for deletion', Data: result });
                    }
                },
                    function (err) {
                        res.status(200).json({ Success: false, Message: 'Error occurred while deleting employee details', Data: err });
                    }
                );
        });

    return router;
};
module.exports = routes;
