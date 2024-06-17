var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var mailer = require('../../Common/Mailer');
var commonfunc = require('../../Common/CommonFunctions');
var async = require('async');

var promise = connect.Sequelize.Promise;
const { Op } = require('sequelize');
var routes = function () {

    router.route('/GetAllRole')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = {where: { IsActive: true  },  attributes: ['Id', 'Code', 'Desc','IsCentralAccess', 'IsActive'], order: ['Code'] };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllRole', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/GetAllActiveRole')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { where: { IsActive: true  }, attributes: ['Id', 'Code'], order: ['Id']  };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllActiveRole', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/GetRoleById/:Id')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetRoleById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });

        });

    router.route('/CheckDuplicateRole/:Value/:Id')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = {
                where: { Code: req.params.Value, Id: { [connect.Op.ne]: req.params.Id } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('Code')), 'Count']]
            };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'Role Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Role Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('RoleService', 'CheckDuplicateRole', err);
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    });
        });

    router.route('/CreateRole')
        .post(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var values = {
                Code: req.body.Code.toString().trim(),
                Desc: req.body.Desc,
                IsActive: req.body.IsActive,
                IsCentralAccess:req.body.IsCentralAccess,
                CreatedBy: req.body.UserId,
            };
            dataaccess.Create(RoleMst, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role Saved Successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('RoleService', 'CreateRole', { message: 'Error Occurred While Saving Record', stack: 'Error Occurred While Saving Record' });
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'CreateRole', err);
                    res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                });
        });

    router.route('/UpdateRole')
        .post(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var values = {
                Code: req.body.Code.toString().trim(),
                Desc: req.body.Desc,
                IsActive: req.body.IsActive,
                IsCentralAccess:req.body.IsCentralAccess,
                ModifiedBy: req.body.UserId,
                ModifiedDate: connect.sequelize.fn('NOW'),
            };
            var param = { Id: req.body.Id };
            dataaccess.Update(RoleMst, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role Updated Successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('RoleService', 'UpdateRole', { message: 'Error Occurred While Updating Record', stack: 'Error Occurred While Updating Record' });
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'UpdateRole', err);
                    res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                });
        });

    router.route('/GetAllRoleList')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { attributes: ['Code'] };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllRoleList', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    return router;;
};

module.exports = routes;