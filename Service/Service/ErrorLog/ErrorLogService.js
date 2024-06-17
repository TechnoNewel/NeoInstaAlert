var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');

var routes = function () {

    router.route('/GetAllErrorLog')
        .get(function (req, res) {

            const ErrorLog = datamodel.ErrorLog();
            var param = {
                attributes: ['Id', 'ServiceName', 'FunctionName', 'CreatedDate'],
                order: [['CreatedDate']]
            };

            dataaccess.FindAll(ErrorLog, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Error Log Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Error Log Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('ErrorLogService', 'GetAllErrorLog', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Error Log Table', Data: null });
                });
        });

    router.route('/GetErrorLogById/:Id')
        .get(function (req, res) {

            const ErrorLog = datamodel.ErrorLog();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(ErrorLog, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Error Log Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Error Log Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('ErrorLogService', 'GetErrorLogById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Error Log Table', Data: null });
                });

        });




        router.route('/Get_Error_Log_Details')
        .post(function (req, res) {

            var querytext = 'SELECT "Get_Error_Log_Details"(:p_fromdate,:p_todate,:p_ref); FETCH ALL IN "abc"';

          
            var param = {
                replacements: {
                    p_fromdate: req.body.p_fromdate,
                    p_todate: req.body.p_todate,
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
                    dataconn.errorlogger('ErrorLogService', 'Get_Error_Log_Details', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of ErrorLogService', Data: null });
                    console.log("result", err);
                });
        });


    return router;
};

module.exports = routes;