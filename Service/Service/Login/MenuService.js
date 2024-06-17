var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
const { Op } = require('sequelize');
var routes = function () {

    router.route('/GetAllMenuById/:Id')
        .get(function (req, res) {
console.log("req.params",req.params);
            const UIMst = datamodel.UIMst();
            const UIRoleMap = datamodel.UIRoleMap();
            var param = {
                where: { IsActive: true },
                attributrd: ['Id', 'ParentId', 'Title', 'Path', 'Icon', 'CssClass', 'IsChild'],
                include: [
                    {
                        model: UIRoleMap,
                        attributes: ['UIId', 'RoleId', 'Viewer', 'Maker', 'Checker', 'Edit', 'Export', 'Upload'],
                        where: {
                            RoleId: req.params.Id,
                            [connect.Op.or]: [{ Viewer: { [connect.Op.eq]: true } }, { Maker: { [connect.Op.eq]: true } }, { Checker: { [connect.Op.eq]: true } }, { Edit: { [connect.Op.eq]: true } }]
                        }
                    }
                ],
                order: ['Sequence']
            };
            dataaccess.FindAll(UIMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Menus', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('MenuService', 'GetAllMenuById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                });

        });

    router.route('/GetAllActiveMenu')
        .get(function (req, res) {
            const UIMst = datamodel.UIMst();
            var param = { where: { IsActive: true }, attributes: ['Id', 'ParentId', 'Title','DefaultRoleId'], order: ['Sequence'] };
console.log("GetAllActiveMenuparam",param)
            dataaccess.FindAll(UIMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Menus', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('MenuService', 'GetAllActiveMenu', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                });

        });

    return router;

};

module.exports = routes;