var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
const activedirectoryEWM = require('../../Common/ActiveDirectoryEWM');
var activedirectory = require('../../Common/ActiveDirectory');
var commonfunc = require('../../Common/CommonFunctions');
var tokenValidation = require('../../Common/TokenValidation');

var routes = function () {

    router.route('/AuthenticateUser')
        .post(function (req, res) {
            const UserMst = datamodel.UserMst();
            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();
            console.log("req", req.body)

            const Encrypt = commonfunc.Encryption((req.body.Password))

            const Decrypt = commonfunc.Decryption(Encrypt)
            const decryptstring = Decrypt.toString();

            console.log("Encrypt", Encrypt)
            console.log("decryptstring", decryptstring)
            var param = {
                where: { UserName: req.body.UserName, Password: decryptstring, IsActive: true },
                attributes: ['UserId', 'UserCode', 'UserName', 'Password', 'DefaultRoleId', 'BranchId', 'CompId']

            };
            var param = {
                where: { LoginId: { [connect.Op.iLike]: req.body.UserName }, IsActive: true },
                attributes: ['Id', 'LoginId', 'EmpCode', 'EmpName', 'EmailId', 'DefaultRoleId', 'ClientId', 'BranchId', 'CompId'],
                include: [
                    {
                        model: UserRoleMap, attributes: ['RoleId'],
                        include: [{ model: RoleMst, attributes: ['Code'], where: { IsActive: true } }]
                    },
                ]
            };
            console.log("param", param)
            dataaccess.FindOne(UserMst, param)
                .then(function (userresult) {
                    if (userresult != null) {
                        console.log(userresult);
                        if (userresult.ADUser) {

                            let usernameEWM = req.body.UserName + '@ewmwealth.in';
                            let passwordEWM = req.body.Password;

                            activedirectoryEWM.authenticate(usernameEWM, passwordEWM, function (errEWM, authEWM) {

                                if (errEWM) {
                                    // dataconn.errorlogger('LoginService', 'AuthenticateUser', errEWM);
                                }

                                if (authEWM) {
                                    res.status(200).json({ Success: true, Message: 'Authenticated', Data: userresult });
                                }
                                else {
                                    var username = req.body.UserName + '@edelcap.com';
                                    var password = req.body.Password;

                                    activedirectory.authenticate(username, password, function (err, auth) {

                                        if (err) {
                                            dataconn.errorlogger('LoginService', 'AuthenticateUser', err);
                                        }

                                        if (auth) {
                                            res.status(200).json({ Success: true, Message: 'Authenticated', Data: userresult });
                                        }
                                        else {
                                            res.status(200).json({ Success: false, Message: 'You have entered an invalid username or password', Data: null });
                                        }
                                    });
                                }

                            });
                        }
                        else {
                            var param = {
                                where: { LoginId: { [connect.Op.iLike]: req.body.UserName }, Password: { [connect.Op.eq]: req.body.Password } },
                                attributes: ['LoginId']
                            };

                            dataaccess.FindOne(UserMst, param)
                                .then(function (result) {
                                    if (result != null) {
                                        res.status(200).json({ Success: true, Message: 'Authenticated', Data: userresult });
                                    }
                                    else {
                                        res.status(200).json({ Success: false, Message: 'You have entered an invalid username and password', Data: null });
                                    }
                                }, function (err) {
                                    dataconn.errorlogger('LoginService', 'AuthenticateUser', err);
                                    res.status(200).json({ Success: false, Message: 'Please Enter valid Username and Password', Data: null });

                                });

                        }
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Please Enter valid Username and Password', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('LoginService', 'AuthenticateUser', err);
                    res.status(200).json({ Success: false, Message: 'User does not exists in the system', Data: null });
                });
        });




        router.route('/compbranchname')
        .post(function (req, res) {

            // var querytext = 'SELECT "SubmitDataUpload"(:uan_number,:pf_number,:createdby,:p_ref); FETCH ALL IN "abc"';

            var querytext = 'SELECT "Company_Branch_UserId_Details"(:compid,:branchid,:userid,:p_ref); FETCH ALL IN "abc"';

            
            var param = {
                replacements: {
                    compid: req.body.compId,
                    branchid: req.body.BranchId,
                    userid: 1,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    //       console.log("result", result);
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('LoginService', 'compbranchname', err);
                    res.status(200).json({ Success: false, Message: 'User has no access', Data: null });
                    console.log("result", err);
                });
        });
        

        

        router.route('/compbranchUserName')
        .post(function (req, res) {

            // var querytext = 'SELECT "SubmitDataUpload"(:uan_number,:pf_number,:createdby,:p_ref); FETCH ALL IN "abc"';

            var querytext = 'SELECT "compbranchUserName"(:compid,:branchid,:userid,:p_ref); FETCH ALL IN "abc"';

            
            var param = {
                replacements: {
                    compid: req.body.compId,
                    branchid: req.body.BranchId,
                    userid: 1,
                    p_ref: 'abc'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    //       console.log("result", result);
                    result.shift();
                    res.status(200).json({ Success: true, Message: "Data Access", Data: result });
                }, function (err) {
                    dataconn.errorlogger('LoginService', 'compbranchname', err);
                    res.status(200).json({ Success: false, Message: 'User has no access', Data: null });
                    console.log("result", err);
                });
        });
        


        // router.route('/AuthenticateUser')
    // .post(async function (req, res) {

    //     try {
            
    //         let finalResponseData = [{
    //             'UserDetails' : '',
    //             'MenuDetails' : []
    //         }];

    //         let userQuery = `SELECT * FROM "UserMst"
    //             WHERE "EmpCode" = '${req.body.UserName}' AND "Password" = '${req.body.Password}' 
    //             AND "IsActive" = TRUE`;

    //         let userResult = await connect.sequelize.query(userQuery);

    //        // console.log('User result', userResult);
    //         if (userResult[0].length > 0) {

    //             finalResponseData[0]['UserDetails'] = userResult[0];

    //             // let menuQuery = `SELECT * FROM "UIMst" AS "UI"
    //             // JOIN "UIRoleMap" AS "UR" ON "UI"."Id" = "UR"."UIId"
    //             // WHERE "UR"."RoleId" = ${userResult[0][0].DefaultRoleId} 
    //             // AND "UI"."IsActive" = TRUE AND "UR"."IsActive" = TRUE
    //             // ORDER BY "UI"."Sequence"`;

    //             // let menuQuery = `SELECT * FROM "UIMst" AS "UI"
    //             // JOIN "UIRoleMap" AS "UR" ON "UI"."Id" = "UR"."UIId"
    //             // WHERE "UR"."RoleId" = ${userResult[0][0].DefaultRoleId} 
    //             // ORDER BY "UI"."Sequence"`;


    //             let menuQuery = `select "UI"."Id", "UI"."ParentId", "UI"."Title", "UI"."Path", "UI"."Icon", "UI"."CssClass", "UI"."Sequence", "UI"."IsActive", "UI"."IsChild", "UI"."CreatedBy",
    //             "UI"."DefaultRoleId", "UR"."UIId", "UR"."RoleId","UR"."Viewer", "UR"."Maker", "UR"."Checker", "UR"."Edit", "UR"."Export", "UR"."Upload", 
    //             "UR"."IsActive", "UR"."CreatedBy"
    //             FROM "UIMst" AS "UI"
    //              JOIN "UIRoleMap" AS "UR" ON "UI"."Id" = "UR"."UIId"
    //              WHERE "UR"."RoleId" = ${userResult[0][0].DefaultRoleId} 
    //              ORDER BY "UI"."Sequence"`;

    //             let menuResult = await connect.sequelize.query(menuQuery);

    //        //     console.log('menuResult', menuResult);
    //             if (menuResult.length > 0) {

    //               //  console.log("currentUserID",menuResult[0]);

    //                 finalResponseData[0]['MenuDetails'] = menuResult[0];
    //                 let jwt_token = tokenValidation.createToken(finalResponseData);

    //                 let currentUserID = finalResponseData[0]['UserDetails'][0].Id;
    //                // console.log("currentUserID",finalResponseData[0]['UserDetails'][0]);

    //                 const checkTokenByUserId = `SELECT COUNT(*) FROM "ER_USER_SESSION_DETAILS"
    //                     WHERE "USER_ID" = ${currentUserID} AND "IS_ACTIVE" = TRUE
    //                     GROUP BY "SESSION_ID"
    //                     ORDER BY "SESSION_ID" DESC`;

    //                 const checkTokenByUserIdResult = await connect.sequelize.query(checkTokenByUserId);

    //                 const ER_USER_SESSION_DETAILS = datamodel.ER_USER_SESSION_DETAILS();

    //                 if(checkTokenByUserIdResult[0].length > 0 && checkTokenByUserIdResult[0][0]['count'] > 0){

    //                     var valuesUpdate = {
    //                         EXP_TIME: 0,
    //                         IS_ACTIVE: false,
    //                     };

    //                     var paramsUpdate = {
    //                         USER_ID: currentUserID,
    //                         IS_ACTIVE: true,
    //                     };
        
    //                     await dataaccess.Update(ER_USER_SESSION_DETAILS, valuesUpdate,paramsUpdate);

    //                     var valuesCreate = {
    //                         USER_ID: currentUserID,
    //                         TOKEN: jwt_token,
    //                         EXP_TIME: 1696959634,
    //                         IS_ACTIVE: true,
    //                     };
        
    //                     await dataaccess.Create(ER_USER_SESSION_DETAILS, valuesCreate);

    //                 }
    //                 else{

    //                     var valuesCreate = {
    //                         USER_ID: currentUserID,
    //                         TOKEN: jwt_token,
    //                         EXP_TIME: 1696959634,
    //                         IS_ACTIVE: true,
    //                     };
        
    //                     await dataaccess.Create(ER_USER_SESSION_DETAILS, valuesCreate);

    //                 }

    //                 res.status(200).json({ Success: true, Message: 'Sign Up Successfully .', Data: jwt_token });
    //                 console.log('Sign Up Successfully .');

    //             }
    //             else {
    //                 res.status(200).json({ Success: false, Message: 'User credentials invalid .', Data: null });

    //             }

    //         }
    //         else {
    //             res.status(200).json({ Success: false, Message: 'User credentials invalid .', Data: null });

    //         }

    //     } 
    //     catch (errorCatch) {
    //         console.log("errorCatch",errorCatch);
    //         res.status(200).json({ Success: false, Message: 'Error occurred while Sign In .', Data: null });
    //     }

    // });

    return router;
};

module.exports = routes;