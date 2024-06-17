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
const axios = require('axios');
const nodemailer = require('nodemailer');
const { notifyMail } = require('../../Common/Mailer')


var routes = function () {

    router.route('/GetCompanyName')
        .get(function (req, res) {
            console.log('Result company master api call');
            const Company_Master = datamodel.Company_Master();

            var param = {
                attributes: ['CompanyId', 'CompName', 'Comp_PANNO', 'Comp_emailid', 'IsActive', 'CreatedOn', 'ModifiedOn',
                    'CreatedBy', 'ModifiedBy'],

                // where: {
                //     CreatedBy: req.body.p_userid
                // }
            };

            dataaccess.FindAll(Company_Master, param)
                .then(function (result) {
                    if (result != null) {
                        console.log("Result", result);
                        res.status(200).json({ Success: true, Message: 'Company_Master Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Company_Master Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('DataApprovalService', 'GetCompanyName', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Company_Master Table', Data: null });
                });

        });


    router.route('/GetBranchName')
        .get(function (req, res) {
            const Branch_Master = datamodel.Branch_Master();

            var param = {
                attributes: ['BranchId', 'CompanyId', 'CompBranchName', 'CompLocation', 'Comp_ContactNo', 'Comp_ContactPerson',
                    'IsActive', 'CreatedOn', 'ModifiedOn', 'CreatedBy', 'ModifiedBy'],

                // where: {
                //     CreatedBy: req.body.p_userid
                // }
            };

            dataaccess.FindAll(Branch_Master, param)
                .then(function (result) {
                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'Branch_Master Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Branch_Master Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('DataApprovalService', 'GetBranchName', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Branch_Master Table', Data: null });
                });

        });


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


    router.route('/PendingData')
        .post(function (req, res) {

            // var querytext = 'SELECT "Get_PendingData"(:p_companyname,:p_branchname,:p_location,:p_ref); FETCH ALL IN "abc"';

            var querytext = 'SELECT "Get_PendingData_New"(:p_companyname,:p_branchname,:p_location,:p_ref); FETCH ALL IN "abc"';


            var param = {
                replacements: {
                    p_companyname: req.body.p_companyname,
                    p_branchname: req.body.p_branchname,
                    p_location: req.body.p_location,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('UploadService', 'PendingData', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Report', Data: null });
                    console.log("result", err);
                });
        });


    //13-dec
    // router.route('/AprrovalStatusUpdate')
    //     .post(function (req, res) {

    //         const NewEmployeePFDetail_Upload = datamodel.NewEmployeePFDetail_Upload();


    //         var values = {
    //             Status: req.body.p_status,
    //             ModifiedBy: req.body.UserId,
    //             ModifiedDate: connect.sequelize.fn("NOW"),
    //         };
    //         var param = { Id: req.body.p_statusid };
    //         console.log('param', param);
    //         dataaccess.Update(NewEmployeePFDetail_Upload, values, param)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     res.status(200).json({ Success: true, Message: 'NewEmployeePFDetail_Upload updated successfully', Data: result });
    //                 }
    //                 else {
    //                     dataconn.errorlogger('DataApprovalService', 'AprrovalStatusUpdate', { message: 'No object found', stack: '' });
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('DataApprovalService', 'AprrovalStatusUpdate', err);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //             });
    //     });



    router.route('/AprrovalStatusUpdate')
        .post(function (req, res) {

            const EmployeePFDetail = datamodel.EmployeePFDetail();


            var values = {
                Status: req.body.p_status,
                ModifiedBy: req.body.UserId,
                ModifiedDate: connect.sequelize.fn("NOW"),
            };
            var param = { Id: req.body.p_statusid };
            console.log('param', param);
            dataaccess.Update(EmployeePFDetail, values, param)
                .then(function (result) {
                    if (result != null) {

                        var querytext = 'SELECT "DataStatus_Update_Count"(:status,:companyid,:branchid,:userid,:createdby,:p_ref); FETCH ALL IN "abc"';

                        var param = {
                            replacements: {
                                status: req.body.p_status, //'PendingForApproval',
                                companyid: req.body.CompId,
                                branchid: req.body.BranchId,
                                userid: req.body.UserId,
                                createdby: req.body.CreatedBy,
                                p_ref: 'abc'
                            },
                            type: connect.sequelize.QueryTypes.SELECT
                        }

                        connect.sequelize
                            .query(querytext, param)
                            .then(function (result) {
                                result.shift();


                                if (req.body.p_status === 'Reject') {




                                    const fromEmail = 'Bhushan.c@neweltechnologies.com';
                                    const toEmail = 'Bhushan.c@neweltechnologies.com';
                                    const ccEmail = 'joshy.j@neweltechnologies.com';
                                    const subjectEmail = 'Rejected';
                                    const htmlEmailTemplatePath = '';
                                    const dataEmailTemplateBody = 'PF Status is Rejected';

                                    notifyMail(fromEmail, toEmail, ccEmail, subjectEmail, htmlEmailTemplatePath, dataEmailTemplateBody)
                                        .then(result => {
                                            console.log('Email sent successfully:', result);
                                        })
                                        .catch(error => {
                                            console.error('Error sending email:', error);
                                        });




                                }
                                //mail send for reject status 

                                // const transporter = nodemailer.createTransport({
                                //     service: 'smtp.com',
                                //     auth: {
                                //         user: 'Bhushan.c@neweltechnologies.com',
                                //         pass: 'India@1234'
                                //     }
                                // });

                                // // Define the email options
                                // const mailOptions = {
                                //     from: 'your_email@gmail.com',
                                //     to: 'recipient_email@example.com',
                                //     subject: 'Test Email',
                                //     text: 'Hello, this is a test email from Node.js!'
                                // };

                                // // Send the email
                                // transporter.sendMail(mailOptions, (error, info) => {
                                //     if (error) {
                                //         console.error('Error:', error);
                                //     } else {
                                //         console.log('Email sent:', info.response);
                                //     }
                                // });









                                //res.status(200).json({ Success: true, Message: "Data Access", Data: result });
                            }, function (err) {
                                dataconn.errorlogger('DataStatusService', 'GetDataStatus', err);
                                // res.status(200).json({ Success: false, Message: 'User has no access of GetDataStatus', Data: null });
                                console.log("result", err);
                            });



                        res.status(200).json({ Success: true, Message: 'EmployeePFDetail updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('DataApprovalService', 'AprrovalStatusUpdate', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('DataApprovalService', 'AprrovalStatusUpdate', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });





    router.route('/SubmitDataApproval')
        .post(function (req, res) {

            // var querytext = 'SELECT "SubmitDataApproval"(:p_companyname,:p_branchname,:p_location,:p_ref); FETCH ALL IN "abc"';

            var querytext = 'SELECT "SubmitDataApproval_New"(:p_companyname,:p_branchname,:p_location,:p_ref); FETCH ALL IN "abc"';


            var param = {
                replacements: {
                    p_companyname: req.body.p_companyname,
                    p_branchname: req.body.p_branchname,
                    p_location: req.body.p_location,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    result.shift();


                    var querytext = 'SELECT "DataStatus_Update_Count"(:status,:companyid,:branchid,:userid,:createdby,:p_ref); FETCH ALL IN "abc"';

                    var param = {
                        replacements: {
                            status: 'Approve', //'PendingForApproval',
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



                    res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('UploadService', 'SubmitDataApproval', err);
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
                    CreatedBy: req.body.p_userid
                },

            };


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


















    router.route('/PanVerification').post(async (req, res) => {
        try {
            // Assuming model is in the request body
            const model = req.body;


            var values = {
                "username": "neweltechnologies_test",
                "password": "YxnF2WOqtz4Imkv"
            };

            // Perform validation and processing as needed

            // Make an external API call using Axios
            const externalApiUrl = 'https://preproduction.signzy.tech/api/v2/patrons/login'; // Replace with your external API URL
            const externalApiResponse = await axios.post(externalApiUrl, values);

            // Assuming the external API response is needed in the final response
            const response = {
                Success: true,
                Message: 'Pan verification successful',
                ExternalApiData: externalApiResponse.data,
                Data: values
            };

            // Send the response
            res.json(response);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ Success: false, Message: 'Internal server error' });
        }
    });





    // IDENTITY OBJECT API


    router.route('/ObjectId').post(async (req, res) => {
        try {
            // Assuming model is in the request body
            const model = req.body;

            console.log('api call');

            var values = {
                "username": "neweltechnologies_test",
                "password": "YxnF2WOqtz4Imkv"
            };

            const patronid = req.body.id;
            const accesstoken = req.body.accesstoken;
            var options = {
                method: 'POST',
                // url: 'https://signzy.tech/api/v2/patrons/...patron-id.../identities',
                url: `https://signzy.tech/api/v2/patrons/${patronid}/identities`,

                headers: {
                    'Accept-Language': 'en-US,en;q=0.8',
                    Accept: '*/*',
                    Authorization: accesstoken//'<Access-Token>'
                },
                data: {
                    type: 'individualPan',
                    callbackUrl: '',
                    email: 'Bhushan.c@neweltechnologies.com',
                    images: ['E:/Pan/Pan.jpg', 'E:/Pan/Panbackside.jpg']
                }
            };


            console.log(options);
            // Perform validation and processing as needed

            // Make an external API call using Axios
            const externalApiUrl = 'https://preproduction.signzy.tech/api/v2/patrons/login'; // Replace with your external API URL

            axios.request(options).then(function (response) {
                //              console.log(response.data);
                res.json(response);
            }).catch(function (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
                res.status(error.response ? error.response.status : 500).json({
                    Success: false,
                    Message: 'Internal server error or unauthorized',
                });
            });

            // const externalApiResponse = await axios.post(url, values);

            // // Assuming the external API response is needed in the final response
            // const response = {
            //     Success: true,
            //     Message: 'Pan verification successful',
            //     ExternalApiData: externalApiResponse.data,
            //  //   Data: values
            // };

            // // Send the response
            // res.json(response);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ Success: false, Message: 'Internal server error' });
        }
    });



    // router.route('/PanVerification')
    // .post(function (req, res) {

    //     var querytext = 'SELECT "SubmitDataApproval"(:p_companyname,:p_branchname,:p_location,:p_ref); FETCH ALL IN "abc"';
    //     var param = {
    //         replacements: {
    //             p_companyname: req.body.p_companyname,
    //             p_branchname: req.body.p_branchname,
    //             p_location: req.body.p_location,
    //             p_ref: 'abc'
    //         },
    //         type: connect.sequelize.QueryTypes.SELECT
    //     }

    //     connect.sequelize
    //         .query(querytext, param)
    //         .then(function (result) {
    //             result.shift();
    //             res.status(200).json({ Success: true, Message: "Report Data Access", Data: result });
    //         }, function (err) {
    //             dataconn.errorlogger('UploadService', 'PendingData', err);
    //             res.status(200).json({ Success: false, Message: 'User has no access of Report', Data: null });
    //             console.log("result", err);
    //         });
    // });



    return router;

};

module.exports = routes;