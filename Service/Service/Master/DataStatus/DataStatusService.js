var express = require('express');
var router = express.Router();

var connect = require('../../../Data/Connect');
var datamodel = require('../../../Data/DataModel');
var dataaccess = require('../../../Data/DataAccess');
var dataconn = require('../../../Data/DataConnection');

var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var multer = require("multer");
const path = require('path');
var upload = multer();
const fse = require("fs-extra");
const fs = require("fs");
//const config = require('../../Config');
const config = require('../../../Config');
var moment = require("moment");
const axios = require('axios');

var routes = function () {

    router.route('/GetDataStatus')
        .post(function (req, res) {


            if(req.body.selecttype == 'Current Month Data to PF Server'){
                var querytext = 'SELECT "GetDataStatus_CurrentMonthDataPfServer"(:selecttype,:p_companyid,:p_branchid,:p_userid,:p_ref); FETCH ALL IN "abc"';

            }
            else{
            var querytext = 'SELECT "GetDataStatus"(:selecttype,:p_companyid,:p_branchid,:p_userid,:p_ref); FETCH ALL IN "abc"';
            }
            
            var param = {
                replacements: {
                    selecttype: req.body.selecttype,
                    p_companyid: req.body.p_companyid,
                    p_branchid: req.body.p_branchid,
                    p_userid: req.body.p_userid,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('DataStatusService', 'GetDataStatus', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of GetDataStatus', Data: null });
                    console.log("result", err);
                });
        });





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






        
        router.route('/HomePageDataStatus')
        .post(function (req, res) {


                var querytext = 'SELECT "HomePageDataStatus"(:selecttype,:p_companyid,:p_branchid,:p_userid,:p_ref); FETCH ALL IN "abc"';
            
            var param = {
                replacements: {
                    selecttype: '',
                    p_companyid: req.body.p_companyid,
                    p_branchid: req.body.p_branchid,
                    p_userid: req.body.p_userid,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('DataStatusService', 'HomePageDataStatus', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of HomePageDataStatus', Data: null });
                    console.log("result", err);
                });
        });


        
        router.route('/HomePagePrevDataStatus')
        .post(function (req, res) {


                var querytext = 'SELECT "HomePageDataStatus_PrevMonth"(:selecttype,:p_companyid,:p_branchid,:p_userid,:p_ref); FETCH ALL IN "abc"';
            
            var param = {
                replacements: {
                    selecttype: '',
                    p_companyid: req.body.p_companyid,
                    p_branchid: req.body.p_branchid,
                    p_userid: req.body.p_userid,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('DataStatusService', 'HomePagePrevDataStatus', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of HomePagePrevDataStatus', Data: null });
                    console.log("result", err);
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