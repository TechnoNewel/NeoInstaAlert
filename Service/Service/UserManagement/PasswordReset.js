var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var mailer = require('../../Common/Mailer');
var commonfunc = require('../../Common/CommonFunctions');

var routes = function () {


    // router.route('/PasswordReset')
    // .post(function (req, res) {

    //     var querytext = 'SELECT "Password_Reset"(:p_oldpassword,:p_newpassword,:p_userid,:p_ref); FETCH ALL IN "abc"';

      
    //     var param = {
    //         replacements: {
    //             p_oldpassword: req.body.p_oldPassword,
    //             p_newpassword: req.body.p_newPassword,
    //             p_userid: req.body.p_userid,
    //             p_ref: 'abc'
    //         },
    //         type: connect.sequelize.QueryTypes.SELECT
    //     }

    //     connect.sequelize
    //         .query(querytext, param)
    //         .then(function (result) {
    //             //       console.log("result", result);
    //             result.shift();
    //             res.status(200).json({ Success: true, Message: "PasswordReset Reset Successfully", Data: result });
    //         }, function (err) {
    //             dataconn.errorlogger('PasswordResetService', 'PasswordReset', err);
    //             res.status(200).json({ Success: false, Message: 'User has no access of PasswordReset', Data: null });
    //             console.log("result", err);
    //         });
    // });


    // router.route('/PasswordReset')
    //     .post(function (req, res) {

    //         var querytext = 'SELECT "Password_Reset"(:p_oldpassword,:p_newpassword,:p_userid,:p_ref); FETCH ALL IN "abc"';

    //         var param = {
    //             replacements: {
    //                 p_oldpassword: req.body.p_oldPassword,
    //                 p_newpassword: req.body.p_newPassword,
    //                 p_userid: req.body.p_userid,
    //                 p_ref: 'abc'
    //             },
    //             type: connect.sequelize.QueryTypes.SELECT
    //         }

    //         connect.sequelize
    //             .query(querytext, param)
    //             .then(function (result) {
    //                 result.shift();
    //                 res.status(200).json({ Success: true, Message: "PasswordReset Reset Successfully", Data: result });
    //             })
    //             .catch(function (err) {
    //                 dataconn.errorlogger('PasswordResetService', 'PasswordReset', err);
    //                 res.status(200).json({ Success: false, Message: 'User has no access to PasswordReset', Data: null });
    //                 console.error("result", err);
    //             });
    //     });

    router.route('/PasswordReset')
    .post(async function (req, res) {
        try {
            const result = await connect.sequelize.query(
                'SELECT * FROM "Password_Reset"(:p_oldpassword, :p_newpassword, :p_userid)',
                {
                    replacements: {
                        p_oldpassword: req.body.p_oldPassword,
                        p_newpassword: req.body.p_newPassword,
                        p_userid: req.body.p_userid
                    },
                    type: connect.sequelize.QueryTypes.RAW
                }
            );

            res.status(200).json({
                Success: true,
                Message: 'Password Reset Successfully',
                Data: result
            });
        } catch (error) {
            dataconn.errorlogger('PasswordResetService', 'PasswordReset', error);
            res.status(200).json({
                Success: false,
                Message: 'Error resetting password',
                Data: error
            });
        }
    });


    return router;
};

module.exports = routes;