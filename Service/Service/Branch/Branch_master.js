var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');


var routes = function () {

    router.route('/getallBranchdetails')
        .get(function (req, res) {

            console.log('Branch api call');
            const Branch_Master = datamodel.Branch_Master();
            var param = {
                where: { IsActive: true }, attributes: ['BranchId', 'CompanyId', 'CompBranchName', 'CompLocation', 'Comp_ContactNo', 'Comp_ContactPerson', 'PAN_NO', 'Branch_Type', 'Email', 'CompanyName'],
                order: [['BranchId', 'DESC']],
            }
            // console.log("inside create", values)
            dataaccess.FindAll(Branch_Master, param)
                .then(function (result) {
                    if (result != null) {
                        // console.log("asdfghjkkl", result);
                        res.status(200).json({ Success: true, Message: 'Branch details successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while Branch details', Data: result });
                    }
                }
                    ,
                    function (err) {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving Branch record', Data: err, values });
                    }
                );
        });


    router.route('/getBranchdetailsbyid/:Id')
        .get(function (req, res) {

            const Branch_Master = datamodel.Branch_Master();
            var param = { where: { BranchId: req.params.Id } };

            dataaccess.FindOne(Branch_Master, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Branch details Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Entity', 'GetProductId', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                });

        });


    router.route('/CreateBranch')
        .post(function (req, res) {

            const Branch_Master = datamodel.Branch_Master();


            var param = { where: { PAN_NO: req.body.PAN_NO } };

            dataaccess.FindOne(Branch_Master, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'PAN No is Already Exists', Data: result });
                    }
                    //     else {
                    //         res.status(200).json({ Success: false, Message: 'User Has No Access Of Employee_Closure_Master Table', Data: null });
                    //     }
                    // }, function (err) {
                    //     dataconn.errorlogger('Emp_Closure_Sevice', 'GetEmpClosureId', err);
                    //     res.status(200).json({ Success: false, Message: 'User Has No Access Of Employee_Closure_Master Table', Data: null });
                    // }

                    else {



                        var values = {

                            Comp_ContactNo: req.body.Comp_ContactNo,
                            CompBranchName: req.body.CompBranchName,
                            PAN_NO: req.body.PAN_NO,
                            CompLocation: req.body.CompLocation,
                            Email: req.body.Email,
                            Branch_Type: req.body.Branch_Type,
                            IsActive: true,
                            CompanyId: req.body.CompanyId,
                            CreatedBy: req.body.UserId,
                            CreatedOn: connect.sequelize.fn("NOW"),
                            CompanyName: req.body.CompanyName
                        };


                        console.log("inside create", values)
                        dataaccess.Create(Branch_Master, values)
                            .then(function (result) {
                                if (result != null) {
                                    // console.log("asdfghjkkl", result);
                                    res.status(200).json({ Success: true, Message: 'Branch saved successfully', Data: result });
                                }
                                else {

                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving Branch record', Data: result });
                                }
                            }
                                ,
                                function (err) {

                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
                                }
                            );

                    }
                });
        });

    // update-start
    router.route('/UpdateBranchForm')
        .post(function (req, res) {
            const Branch_Master = datamodel.Branch_Master();

            var values = {

                Comp_ContactNo: req.body.Comp_ContactNo,
                CompBranchName: req.body.CompBranchName,
                PAN_NO: req.body.PAN_NO,
                CompLocation: req.body.CompLocation,
                Email: req.body.Email,
                Branch_Type: req.body.Branch_Type,
                IsActive: true,
                ModifiedBy: req.body.UserId,
                ModifiedOn: connect.sequelize.fn("NOW"),
                CompanyId: req.body.CompanyId,
                CompanyName: req.body.CompanyName

            };

            // Assuming you have a parameter :id in the route to specify the record to update
            var param = { BranchId: req.body.BranchId };

            // Update the record with the new values
            dataaccess.Update(Branch_Master, values, param)
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


    router.route('/DeleteBranchDetails')

        .post(function (req, res) {

            const Branch_Master = datamodel.Branch_Master();


            var param = { BranchId: req.body.BranchId, IsActive: true };

            //   console.log("params",param)

            dataaccess.Delete(Branch_Master, param)
                .then(function (result) {
                    // console.log("Record deleted successfully", result);
                    if (result != null && result > 0) {

                        res.status(200).json({ Success: true, Message: 'Branch details deleted successfully', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'No Branch details found for deletion', Data: result });
                    }
                },
                    function (err) {
                        res.status(200).json({ Success: false, Message: 'Error occurred while deleting Branch details', Data: err });
                    }
                );
        });



    return router;

};
module.exports = routes;
