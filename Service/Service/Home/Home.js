var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {
    router.route('/GetcountforDashboard')
        .get(function (req, res) {
            const RequestMainInfo = datamodel.RequestMainInfo();
            var param = {
                attributes: [
                    [connect.sequelize.fn('COUNT', connect.sequelize.col('StatusId')), 'Total Count']
                ],
                group: ['StatusId']
            };
            dataaccess.FindAndCountAll(RequestMainInfo, param)
                .then(function (resultTransaction) {
                    if (resultTransaction != null) {
                        if (resultTransaction != null) {
                            res.status(200).json({ Success: true, Message: 'GetcountforDashboard', DataTransaction: resultTransaction, });
                        }
                        else {
                            res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                        }
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                    }
                }, function (err) {
                    console.log("err", err)
                    res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                });
        });


    router.route('/GetcountforMasterDashboard')
        .get(function (req, res) {
            const BranchMst = datamodel.BranchMst();
            var param = {
                attributes: [
                    [connect.sequelize.fn('COUNT', connect.sequelize.col('BranchId')), 'Total Count']
                ],
            };
            dataaccess.FindAndCountAll(BranchMst, param)
                .then(function (resultBranch) {
                    if (resultBranch != null) {
                        const LobMst = datamodel.LobMst();
                        var param = {
                            attributes: [
                                [connect.sequelize.fn('COUNT', connect.sequelize.col('LobId')), 'Total Count']
                            ],
                        };
                        dataaccess.FindAndCountAll(LobMst, param)
                            .then(function (resultlobMst) {
                                if (resultlobMst != null) {
                                    const CityMst = datamodel.CityMst();
                                    var param = {
                                        attributes: [
                                            [connect.sequelize.fn('COUNT', connect.sequelize.col('CityId')), 'Total Count']
                                        ],
                                    };
                                    dataaccess.FindAndCountAll(CityMst, param)
                                        .then(function (resultcityMst) {
                                            if (resultcityMst != null) {

                                                const StateMst = datamodel.StateMst();
                                                var param = {
                                                    attributes: [
                                                        [connect.sequelize.fn('COUNT', connect.sequelize.col('StateId')), 'Total Count']
                                                    ],
                                                };
                                                dataaccess.FindAndCountAll(StateMst, param)
                                                    .then(function (resultstatemst) {
                                                        if (resultstatemst != null) {
                                                            const SubLobMst = datamodel.SubLobMst();
                                                            var param = {
                                                                attributes: [
                                                                    [connect.sequelize.fn('COUNT', connect.sequelize.col('SubLobId')), 'Total Count']
                                                                ],
                                                            };
                                                            dataaccess.FindAndCountAll(SubLobMst, param)
                                                                .then(function (resultsublob) {
                                                                    if (resultsublob != null) {
                                                                        const EntityMst = datamodel.EntityMst();
                                                                        var param = {
                                                                            attributes: [
                                                                                [connect.sequelize.fn('COUNT', connect.sequelize.col('EntityId')), 'Total Count']
                                                                            ],
                                                                        };
                                                                        dataaccess.FindAndCountAll(EntityMst, param)
                                                                            .then(function (resultentity) {
                                                                                if (resultentity != null) {
                                                                                    const DistrictMst = datamodel.DistrictMst();
                                                                                    var param = {
                                                                                        attributes: [
                                                                                            [connect.sequelize.fn('COUNT', connect.sequelize.col('DistrictId')), 'Total Count']
                                                                                        ],
                                                                                    };
                                                                                    dataaccess.FindAndCountAll(DistrictMst, param)
                                                                                        .then(function (resultdistrict) {
                                                                                            if (resultdistrict != null) {
                                                                                                const RegionMst = datamodel.RegionMst();
                                                                                                var param = {
                                                                                                    attributes: [
                                                                                                        [connect.sequelize.fn('COUNT', connect.sequelize.col('RegionId')), 'Total Count']
                                                                                                    ],
                                                                                                };
                                                                                                dataaccess.FindAndCountAll(RegionMst, param)
                                                                                                    .then(function (resultRegion) {
                                                                                                        if (resultRegion != null) {
                                                                                                            res.status(200).json({ Success: true, Message: 'GetcountforDashboard', DataState: resultstatemst,Datacity: resultcityMst ,DataRegion: resultRegion ,DataSublob: resultsublob, Dataenity: resultentity , Datadistrict: resultdistrict, Datalob: resultlobMst, Databranch: resultBranch, });
                                                                                                        }
                                                                                                        else {
                                                                                                            res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                                                                                        }
                                                                                                    }, function (err) {
                                                                                                        console.log("err", err)
                                                                                                        res.status(200).json({ Success: false, Message: 'User has no access of Emp', Data: null });
                                                                                                    });
                                                                                                }
                                                                                                else {
                                                                                                    res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                                                                                } 
                                                                                        }, function (err) {
                                                                                            console.log("err", err)
                                                                                            res.status(200).json({ Success: false, Message: 'User has no access of Emp', Data: null });
                                                                                        });
                                                                                    }
                                                                                    else {
                                                                                        res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                                                                    } 
                                                                            }, function (err) {
                                                                                console.log("err", err)
                                                                                res.status(200).json({ Success: false, Message: 'User has no access of Emp', Data: null });
                                                                            });
                                                                        }
                                                                        else {
                                                                            res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                                                        } 
                                                                }, function (err) {
                                                                    console.log("err", err)
                                                                    res.status(200).json({ Success: false, Message: 'User has no access of Emp', Data: null });
                                                                });
                                                            }
                                                            else {
                                                                res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                                            }                            
                                                    }, function (err) {
                                                        console.log("err", err)
                                                        res.status(200).json({ Success: false, Message: 'User has no access of Emp', Data: null });
                                                    });
                                            }
                                            else {
                                                res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                            }
                                        }, function (err) {
                                            console.log("err", err)
                                            res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                        });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                                }
                            }, function (err) {
                                console.log("err", err)
                                res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                            });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                    }
                }, function (err) {
                    console.log("err", err)
                    res.status(200).json({ Success: false, Message: 'User has no GetcountforDashboard', Data: null });
                });
        });
    return router;

};

module.exports = routes;
