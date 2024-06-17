var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var mailer = require('../../Common/Mailer');
var commonfunc = require('../../Common/CommonFunctions');

var routes = function () {

    router.route('/GetAllUser')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();

            var param = {
                
                attributes: ['Id', 'LoginId', 'EmpCode', 'EmpName', 'EmailId', 'IsActive'],
                include: [
                    {
                        model: UserRoleMap, attributes: ['RoleId'],
                        include: [{ model: RoleMst, attributes: ['Code'] }]
                    },
                ],
                order: [['CreatedDate']]
            };
           
            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUser', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route('/GetAllActiveUser')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = { where: { IsActive: true }, attributes: ['Id', 'LoginId', 'EmpName'] };

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllActiveUser', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route('/GetUserById/:Id')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();

            var param = {
                where: { Id: req.params.Id },
                include: [
                    { model: UserRoleMap, attributes: ['RoleId'], include: [{ model: RoleMst, attributes: ['Code'] }] },
                ],
                order: [['ModifiedDate']]
            };

            dataaccess.FindOne(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Access Table', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetUserById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });

        });

    router.route('/FindAllUsers/:Text')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = {
                where: { IsActive: true, EmpName: { [connect.Op.iLike]: req.params.Text + '%' } },
                attributes: ['Id', 'LoginId', 'EmpName']
            };
            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'FindAllUsers', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });

        });

    router.route('/CheckDuplicateUser/:Value/:Id')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = {
                where: { LoginId: { [connect.Op.iLike]: req.params.Value }, Id: { [connect.Op.ne]: req.params.Id } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('LoginId')), 'Count']]
            };
            console.log("param",param)

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'User Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('UserService', 'CheckDuplicateUser', err);
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    });
        });

    router.route('/CreateUser')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                var password = commonfunc.RandomString(8, '#aA');

                const UserMst = datamodel.UserMst();
                var values = {
                    LoginId: req.body.LoginId,
                    EmpCode: req.body.EmpCode,
                    EmpName: req.body.EmpName,
                    EmailId: req.body.EmailId,
                    DefaultRoleId: req.body.DefaultRoleId,
                    Password: password,
                    IsActive: req.body.IsActive,
                    CreatedBy: req.body.UserId,
                    ADUser: req.body.ADUser,
                    BranchId: req.body.BranchId,
                    DateOfBirth: req.body.DOB,
                    CompId: req.body.CompID
                };
                console.log("values",values)
                dataaccess.CreateWithTransaction(UserMst, values, trans)
                    .then(function (result) {
                        console.log("result1",result)
                        console.log("resultdsfsfs",trans)
                        if (result != null) {
                            console.log("result2",result)
                            const UserRoleMap = datamodel.UserRoleMap();
                            var mapRoles = [];
                            console.log("req.body.RoleId",req.body.RoleId,result.Id)
                            var promiseRoles = req.body.RoleId.map(function (mapitem) { mapRoles.push({ UserId: result.Id, RoleId: mapitem }); });

                            Promise.all(promiseRoles).then(function () {
                                dataaccess.BulkCreateWithTransaction(UserRoleMap, mapRoles, trans)
                                    .then((roleresult) => {
                                        trans.commit();
                                        res.status(200).json({ Success: true, Message: 'User Saved Successfully', Data: roleresult });
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('UserService', 'CreateUser', err);
                                            res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                                        });
                            });
                        }
                        else{
                            trans.rollback();
                            dataconn.errorlogger('UserService', 'CreateUser', { message: 'Error Occurred While Saving Record', stack: 'Error Occurred While Saving Record' });
                            res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                        }
                    }, function (err) {
                        trans.rollback();
                        dataconn.errorlogger('UserService', 'CreateUser', err);
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                    });
            });
        });

    router.route('/UpdateUser')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                const UserMst = datamodel.UserMst();
                var values = {
                    LoginId: req.body.LoginId,
                    EmpCode: req.body.EmpCode,
                    EmpName: req.body.EmpName,
                    EmailId: req.body.EmailId,
                    IsActive: req.body.IsActive,
                    DefaultRoleId: req.body.DefaultRoleId,
                    ADUser: req.body.ADUser,
                    ModifiedBy: req.body.UserId,
                    ModifiedDate: connect.sequelize.fn('NOW'),
                    BranchId: req.body.BranchId,
                    DateOfBirth: req.body.DOB,
                    CompId: req.body.CompID

                };
                var param = { Id: req.body.Id };

                dataaccess.UpdateWithTransaction(UserMst, values, param, trans)
                    .then(function (result) {
                        if (result != null) {

                            const UserRoleMap = datamodel.UserRoleMap();
                            var roledeleteresult = { UserId: req.body.Id };

                            dataaccess.DeleteWithTransaction(UserRoleMap, roledeleteresult, trans)
                                .then(function (roledeleteresult) {

                                    var mapRoles = [];
                                    var promisesRoles = req.body.RoleId.map(function (mapitem) { mapRoles.push({ UserId: req.body.Id, RoleId: mapitem }); });

                                    Promise.all(promisesRoles).then(function () {
                                        dataaccess.BulkCreateWithTransaction(UserRoleMap, mapRoles, trans)
                                            .then((roleresult) => {
                                                trans.commit();
                                                res.status(200).json({ Success: true, Message: 'User Updated Successfully', Data: result });
                                            }, function (err) {
                                                trans.rollback();
                                                dataconn.errorlogger('UserService', 'UpdateUser', err);
                                                res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                                            });
                                    });
                                }, function (err) {
                                    trans.rollback();
                                    dataconn.errorlogger('UserService', 'UpdateUser', err);
                                    res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                                });
                        };
                    });
            });
        });


    router.route('/GetAllUserList')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = { attributes: ['LoginId', 'EmpCode', 'EmpName'] };

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUserList', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route('/CheckActiveUser/:Id')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();

            var param = { where: { UserId: req.params.Id, IsActive: true } };

            Promise.all([
                dataaccess.FindAndCountAll(UserMst, param)
            ]).then(function (Users) {
                if (Users != null && Users.count > 0) {
                    res.status(200).json({ Success: true, Message: 'Can Not Deactivate This User, Its Already Used In User Master', Data: true });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Can Deactivate, User Is Not Used', Data: false });
                }
            }).catch(err => {
                dataconn.errorlogger('UserService', 'CheckActiveUser', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
            });
        });

    router.route("/GetUserRolesById/:Id")
        .get(function (req, res) {

            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();
            var param = {
                where: { UserId: req.params.Id },
                include: [{ model: RoleMst, attributes: ['Id', 'Code'], where: { IsActive: true } }]
            };

            dataaccess.FindAll(UserRoleMap, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetUserRolesById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route("/UpdateUserDefaultRole")
        .post(function (req, res) {

            const UserMst = datamodel.UserMst();

            var values = { DefaultRoleId: req.body.RoleId };
            var param = { Id: req.body.UserId };

            dataaccess.Update(UserMst, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Default Role Updated Successfully', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'UpdateUserDefaultRole', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    return router;
};

module.exports = routes;