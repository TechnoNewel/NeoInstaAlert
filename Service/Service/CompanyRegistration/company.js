var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');


var routes = function () {





    router.route('/getallCompanydetails')
        .get(function (req, res) {

            const Company_Master = datamodel.Company_Master();
            var param = {
                where: { IsActive: true }, attributes: ['CompanyId', 'CompName', 'Comp_PANNO', 'Comp_emailid'],
                order: [['CompanyId', 'DESC']],

            }
            // console.log("inside create", values)
            dataaccess.FindAll(Company_Master, param)
                .then(function (result) {
                    if (result != null) {
                        // console.log("asdfghjkkl", result);
                        res.status(200).json({ Success: true, Message: 'Company details successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while Company details', Data: result });
                    }
                }
                    ,
                    function (err) {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
                    }
                );
        });


    router.route('/getCompanydetailsbyid/:Id')
        .get(function (req, res) {

            const Company_Master = datamodel.Company_Master();
            var param = { where: { CompanyId: req.params.Id } };

            dataaccess.FindOne(Company_Master, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Company details Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Entity', 'GetProductId', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                });

        });


    // router.route('/CreateCompany')
    //     .post(function (req, res) {

    //         const Company_Master = datamodel.Company_Master();

    //         var values = {

    //             CompName: req.body.CompName,
    //             Comp_PFNo: req.body.Comp_PFNo,
    //             Comp_emailid: req.body.Comp_emailid,
    //             IsActive: true

    //         };

    //         console.log("inside create", values)
    //         dataaccess.Create(Company_Master, values)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     // console.log("asdfghjkkl", result);
    //                     res.status(200).json({ Success: true, Message: 'Company saved successfully', Data: result });
    //                 }
    //                 else {

    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: result });
    //                 }
    //             }
    //                 ,
    //                 function (err) {

    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
    //                 }
    //             );
    //     });















    router.route('/CreateCompany')
        .post(function (req, res) {

            const Company_Master = datamodel.Company_Master();

            var param = { where: { Comp_PANNO: req.body.Comp_PANNO } };

            dataaccess.FindOne(Company_Master, param)
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

                            CompName: req.body.CompName,
                            Comp_PANNO: req.body.Comp_PANNO,
                            Comp_emailid: req.body.Comp_emailid,
                            IsActive: true,
                            CreatedBy: req.body.UserId,
                            CreatedDate: connect.sequelize.fn("NOW"),

                        };

                        console.log("inside create", values)
                        dataaccess.Create(Company_Master, values)
                            .then(function (result) {
                                if (result != null) {
                                    // console.log("asdfghjkkl", result);
                                    res.status(200).json({ Success: true, Message: 'Company saved successfully', Data: result });
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

                    }
                });
        });

    // update-start
    router.route('/UpdateCompanyForm')
        .post(function (req, res) {
            const Company_Master = datamodel.Company_Master();

            var values = {

                CompName: req.body.CompName,
                Comp_PANNO: req.body.Comp_PANNO,
                Comp_emailid: req.body.Comp_emailid,
                IsActive: true,
                ModifiedBy: req.body.UserId,
                ModifiedOn: connect.sequelize.fn("NOW"),
            };

            // Assuming you have a parameter :id in the route to specify the record to update
            var param = { CompanyId: req.body.CompanyId };

            // Update the record with the new values
            dataaccess.Update(Company_Master, values, param)
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


    router.route('/DeleteCompanyDetails')

        .post(function (req, res) {

            const Company_Master = datamodel.Company_Master();


            var param = { CompanyId: req.body.CompanyId, IsActive: true };

            //   console.log("params",param)

            dataaccess.Delete(Company_Master, param)
                .then(function (result) {
                    // console.log("Record deleted successfully", result);
                    if (result != null && result > 0) {

                        res.status(200).json({ Success: true, Message: 'Company details deleted successfully', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'No Company details found for deletion', Data: result });
                    }
                },
                    function (err) {
                        res.status(200).json({ Success: false, Message: 'Error occurred while deleting Company details', Data: err });
                    }
                );
        });



    return router;

};
module.exports = routes;
