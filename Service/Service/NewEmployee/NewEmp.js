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
                where: { IsActive: true }, attributes: ['Id', 'PFDataId', 'CompanyId', 'BranchId', 'UserId', 'PersonalTitle', 'Srno', 'EmpCode', 'Prev_PFNumber',
                    'Prev_UAN', 'PFWages', 'PFnPensionWithdraw', 'WithdrawlDate', 'DateOFLeaving', 'PresentPFNo',
                    'EmpName', 'FatherName', 'HusbandName', 'Father_Husbend_Name', 'MartialStatus', 'Gender', 'DateOfBirth', 'DateOfJoining',
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



    router.route('/CreateEmployeeForm')
        .post(function (req, res) {

            const EmployeePFDetail = datamodel.EmployeePFDetail();


            var values = {

                MartialStatus: req.body.MartialStatus,
                Gender: req.body.Gender,
                EmpName: req.body.EmpName,
                EmpCode: req.body.EmpCode,
                Handicapped: req.body.Handicapped,
                DateOfJoining: req.body.DateOfJoining,
                DateOfBirth: req.body.DateOfBirth,
                PFWages: req.body.PFWages,
                Emailid: req.body.Emailid,
                TypeOFHandicap: req.body.TypeOFHandicap,
                NameAsPerPassport: req.body.NameAsPerPassport,
                PassportNumber: req.body.PassportNumber,
                PassportFromDate: req.body.PassportFromDate,
                PassportValidToDate: req.body.PassportValidToDate,
                IsInternationalWorker: req.body.IsInternationalWorker,
                MobileNo: req.body.MobileNo,
                PanNo: req.body.PanNo,
                NameAsPerPan: req.body.NameAsPerPan,
                AdharNo: req.body.AdharNo,
                NameAsPerAdhar: req.body.NameAsPerAdhar,
                EduQual: req.body.EduQual,
                Country: req.body.Country,
                Father_Husbend_Name: req.body.Father_Husbend_Name,
                RelationShip: req.body.RelationShip_F_H,
                IsActive: true,
                CreatedBy: req.body.UserId,
                CreatedOn: connect.sequelize.fn("NOW"),
                Status: 'PendingForApproval',
                CompanyId: req.body.CompId,
                BranchId: req.body.BranchId,
                UserId: req.body.userId,
                PersonalTitle: req.body.salutation

            };

            console.log("inside create", values)
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
                        console.log("error ", err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
                    }
                );
        });


    // update-start
    router.route('/UpdateEmployeeForm')
        .post(function (req, res) {
            const EmployeePFDetail = datamodel.EmployeePFDetail();

            var values = {
                MartialStatus: req.body.MartialStatus,
                Gender: req.body.Gender,
                EmpName: req.body.EmpName,
                EmpCode: req.body.EmpCode,
                Handicapped: req.body.Handicapped,
                DateOfJoining: req.body.DateOfJoining,
                DateOfBirth: req.body.DateOfBirth,
                PFWages: req.body.PFWages,
                Emailid: req.body.Emailid,
                Country: req.body.Country,
                IsInternationalWorker: req.body.IsInternationalWorker,
                MobileNo: req.body.MobileNo,
                TypeOFHandicap: req.body.TypeOFHandicap,
                NameAsPerPassport: req.body.NameAsPerPassport,
                PassportNumber: req.body.PassportNumber,
                PassportFromDate: req.body.PassportFromDate,
                PassportValidToDate: req.body.PassportValidToDate,
                PanNo: req.body.PanNo,
                NameAsPerPan: req.body.NameAsPerPan,
                AdharNo: req.body.AdharNo,
                NameAsPerAdhar: req.body.NameAsPerAdhar,
                EduQual: req.body.EduQual,
                IsActive: true,
                ModifiedBy: req.body.UserId,
                ModifiedOn: connect.sequelize.fn("NOW"),
                Status: 'PendingForApproval',
                PersonalTitle: req.body.salutation
            };

            // Assuming you have a parameter :id in the route to specify the record to update
            var param = { Id: req.body.Id };

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

    // prev-emp start
    router.route('/CreatePrevEmployeeForm')
        .post(function (req, res) {

            const EmployeePFDetail = datamodel.EmployeePFDetail();

            var values = {

                MartialStatus: req.body.MartialStatus,
                Gender: req.body.Gender,
                EmpName: req.body.EmpName,
                EmpCode: req.body.EmpCode,
                Handicapped: req.body.Handicapped,
                DateOfJoining: req.body.DateOfJoining,
                DateOfBirth: req.body.DateOfBirth,
                Prev_UAN: req.body.Prev_UAN,
                Emailid: req.body.Emailid,
                IsInternationalWorker: req.body.IsInternationalWorker,
                MobileNo: req.body.MobileNo,
                PanNo: req.body.PanNo,
                AdharNo: req.body.AdharNo,
                Country: req.body.Country,
                Nationality: req.body.Nationality,
                MonthlySalary: req.body.MonthlySalary,
                RelationShip: req.body.RelationShip,
                TypeOFHandicap: req.body.TypeOFHandicap,
                PassportFromDate: req.body.PassportFromDate,
                PassportValidToDate: req.body.PassportValidToDate,
                EduQual: req.body.EduQual,
                Father_Husbend_Name: req.body.FatherName,
                IsActive: true,
                CreatedBy: req.body.createdby,
                CreatedOn: connect.sequelize.fn("NOW"),
                Status: req.body.Prev_UAN ? 'PendingForApproval' : 'Draft', //'PendingForApproval',
                CompanyId: req.body.CompId,
                BranchId: req.body.BranchId,
                UserId: req.body.userId,
                PersonalTitle: req.body.salutation_prev,
                NameAsPerAdhar: req.body.NameasperAadharPrev,
                NameAsPerPan: req.body.NameasperpanPrev,
                PFWages: req.body.monthlyEPFWagesprev

            };


            console.log("inside create", values)
            dataaccess.Create(EmployeePFDetail, values)
                .then(function (result) {
                    if (result != null) {
                        // console.log("asdfghjkkl", result);

                        //22-dec-2023
                        var querytext = 'SELECT "DataStatus_Update_Count"(:status,:companyid,:branchid,:userid,:createdby,:p_ref); FETCH ALL IN "abc"';

                        var param = {
                            replacements: {
                                status: req.body.Prev_UAN ? 'PendingForApproval' : 'Draft', //'PendingForApproval',
                                companyid: req.body.CompId,
                                branchid: req.body.BranchId,
                                userid: req.body.userId,
                                createdby: req.body.createdby,
                                p_ref: 'abc'
                            },
                            type: connect.sequelize.QueryTypes.SELECT
                        }

                        connect.sequelize
                            .query(querytext, param)
                            .then(function (result) {
                                result.shift();
                                //res.status(200).json({ Success: true, Message: "Data Access", Data: result });
                            }, function (err) {
                                dataconn.errorlogger('DataStatusService', 'GetDataStatus', err);
                                // res.status(200).json({ Success: false, Message: 'User has no access of GetDataStatus', Data: null });
                                console.log("result", err);
                            });

                        res.status(200).json({ Success: true, Message: 'Emoloyee saved successfully', Data: result });
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

    router.route('/UpdatePrevEmployeeForm')
        .post(function (req, res) {
            const EmployeePFDetail = datamodel.EmployeePFDetail();

            var values = {

                MartialStatus: req.body.MartialStatus,
                Gender: req.body.Gender,
                EmpName: req.body.EmpName,
                EmpCode: req.body.EmpCode,
                Handicapped: req.body.Handicapped,
                DateOfJoining: req.body.DateOfJoining,
                DateOfBirth: req.body.DateOfBirth,
                Prev_UAN: req.body.Prev_UAN,
                Emailid: req.body.Emailid,
                IsInternationalWorker: req.body.IsInternationalWorker,
                MobileNo: req.body.MobileNo,
                PanNo: req.body.PanNo,
                AdharNo: req.body.AdharNo,
                Country: req.body.Country,
                Nationality: req.body.Nationality,
                MonthlySalary: req.body.MonthlySalary,
                RelationShip: req.body.RelationShip,
                TypeOFHandicap: req.body.TypeOFHandicap,
                PassportFromDate: req.body.PassportFromDate,
                PassportValidToDate: req.body.PassportValidToDate,
                EduQual: req.body.EduQual,
                Father_Husbend_Name: req.body.FatherName,
                IsActive: true,
                ModifiedBy: req.body.userId,
                ModifiedOn: connect.sequelize.fn("NOW"),
                Status: req.body.Prev_UAN ? 'PendingForApproval' : 'Draft',//'PendingForApproval',
                PersonalTitle: req.body.salutation_prev,
                NameAsPerAdhar: req.body.NameasperAadharPrev,
                NameAsPerPan: req.body.NameasperpanPrev,
                PFWages: req.body.monthlyEPFWagesprev,
                CompanyId: req.body.CompId,
                BranchId: req.body.BranchId,
                UserId: req.body.userId,
                PersonalTitle: req.body.salutation_prev,
                NameAsPerAdhar: req.body.NameasperAadharPrev,
                NameAsPerPan: req.body.NameasperpanPrev,
                PFWages: req.body.monthlyEPFWagesprev,
                ModifiedBy: req.body.ModifiedBy
            };


            // Assuming you have a parameter :id in the route to specify the record to update
            var param = { Id: req.body.Id };

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


    return router;

};
module.exports = routes;
