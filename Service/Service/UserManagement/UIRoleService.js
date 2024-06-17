var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {

    router.route('/GetUIRoleMap/:Id')
        .get(function (req, res) {

            const UIRoleMap = datamodel.UIRoleMap();
            const RoleMst = datamodel.RoleMst();
            var param = {
                where: { RoleId: req.params.Id },
                include: [
                    { model: RoleMst, attributes: ['Code'], where: { IsActive: true } },
                ]
            };

            console.log('param..', param);
            dataaccess.FindAll(UIRoleMap, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'UI Role Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of UI Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UIRoleService', 'GetUIRoleMap', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of UI Role Table', Data: null });
                });
        });

    router.route('/CreateUIRoleMap')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                const UIRoleMapModel = datamodel.UIRoleMap();
                var param = { RoleId: req.body.RoleId };

                dataaccess.DeleteWithTransaction(UIRoleMapModel, param, trans)
                    .then((resultDel) => {
                        var mapParams = [];
                        var UIRoleMap = JSON.parse(req.body.UIRoleMap);
                        var promises = UIRoleMap.map(function (mapitem) {
                            mapParams.push({
                                RoleId: req.body.RoleId,
                                UIId: mapitem.UIId,
                                Viewer: mapitem.Viewer,
                                Maker: mapitem.Maker,
                                Checker: mapitem.Checker,
                                Edit: mapitem.Edit,
                                Export: mapitem.Export,
                                Upload: mapitem.Upload,
                                CreatedBy: req.body.UserId
                            });
                        });

                        Promise.all(promises).then(function () {
                            dataaccess.BulkCreateWithTransaction(UIRoleMapModel, mapParams, trans)
                                .then((result) => {
                                    trans.commit();
                                    res.status(200).json({ Success: false, Message: "UI Role Config Saved Successfully", Data: result });
                                },
                                    function (err) {
                                        trans.rollback();
                                        dataconn.errorlogger('UIRoleService', 'CreateUIRoleMap', err);
                                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                                    });
                        });
                    }, (err) => {
                        trans.rollback();
                        dataconn.errorlogger('UIRoleService', 'CreateUIRoleMap', err);
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Records', Data: null });

                    });
            });
        });

    return router;

};

module.exports = routes;