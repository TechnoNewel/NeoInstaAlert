var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var multer = require("multer");
const path = require('path');
var upload = multer();
const fse = require("fs-extra");
const fs = require("fs");
const config = require('../../Config');
var Sequelize = connect.Sequelize;
const Op = Sequelize.Op;

const sequelize = connect.Sequelize;
var routes = function () {

    router.route('/GetAllproducttype')
    .get(function (req, res) {
        const Scrip_Product_mapping = datamodel.Scrip_Product_mapping();
    
        var param = {  
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('Product_type')), 'Product_type'],
            ],
              };

        dataaccess.FindAll(Scrip_Product_mapping, param)
            .then(function (result) {
                if (result != null) {
                   
                    res.status(200).json({ Success: true, Message: 'Scrip_Product_mapping Table Access', Data: result });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                }
            }, function (err) {
                dataconn.errorlogger('Script_MasterSevice', 'GetAllindustry', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
            });

    });

        router.route('/GetAllType')
        .get(function (req, res) {
            const Scrip_Product_mapping = datamodel.Scrip_Product_mapping();
        
            var param = {  
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('Type')), 'Type'],
                ],
                  };
    
            dataaccess.FindAll(Scrip_Product_mapping, param)
                .then(function (result) {
                    if (result != null) {
                       
                        res.status(200).json({ Success: true, Message: 'Scrip_Product_mapping Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Scrip_Product_mappingService', 'GetAllType', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                });
    
        });
    

    router.route('/GetAllProductdetails')
    .get(function (req, res) {
        const Scrip_Product_mapping = datamodel.Scrip_Product_mapping();
    
        var param = {  
            attributes: ['Id','ScripId','Product_type', 'model','From_Date','To_Date','Type'] ,
              };

        dataaccess.FindAll(Scrip_Product_mapping, param)
            .then(function (result) {
                if (result != null) {
                   
                    res.status(200).json({ Success: true, Message: 'Scrip_Product_mapping Table Access', Data: result });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                }
            }, function (err) {
                dataconn.errorlogger('Script_MasterSevice', 'GetAllProductdetails', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
            });

    });


    router.route('/GetProductId/:Id')
        .get(function (req, res) {

            const Scrip_Product_mapping = datamodel.Scrip_Product_mapping();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(Scrip_Product_mapping, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Scrip_Product_mapping Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Entity', 'GetProductId', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Scrip_Product_mapping Table', Data: null });
                });

        });





    router.route('/UpdateProduct')
        .post(function (req, res) {

            const Scrip_Product_mapping = datamodel.Scrip_Product_mapping();
            var values = {
                Id: req.body.Id,
                ScripId: req.body.ScripId,
                Product_type: req.body.ProductType,
                model: req.body.MODELP,
            //    "nifty50%": req.body.NIFTY50,
                From_Date: req.body.FromDate1,
                To_Date: req.body.ToDate1,
                IsActive: req.body.IsActive,
                ModifiedBy: req.body.UserId,
                ModifiedDate: connect.sequelize.fn("NOW"),
                Type: req.body.Type,
            };
            var param = { Id: req.body.Id };
            dataaccess.Update(Scrip_Product_mapping, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Script_Series_mapping updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('Script_MasterSevice', 'UpdateSeries', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('Script_MasterSevice', 'UpdateSeries', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });


        router.route('/GetAllClientData')
        .get(function (req, res) {
            const Client_Master = datamodel.Client_Master();
        
            var param = {  
                attributes: [
                    'Id', 'ClientName'
                ],
                order: [[Sequelize.col('Id'), 'ASC']],
                  };
    
            dataaccess.FindAll(Client_Master, param)
                .then(function (result) {
                    if (result != null) {
                       
                        res.status(200).json({ Success: true, Message: 'Client_Master Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Client_Master Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('XIRR_MasterSevice', 'GetAllClientData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Client_Master Table', Data: null });
                });
    
        });
    

        router.route('/SaveXIRRdetails')
        .post(function (req, res) {

            const XIRR_Transactions = datamodel.XIRR_Transactions();
            var values = {
                Particulars: req.body.Particulars,
                Units: req.body.Units,
                NAV_Pre_Tax: req.body.Nav_Pre_Tax,
                NAV_Post_Tax: req.body.Nav_Post_Tax,
                Commitment: req.body.Commitment,
                NAV_Pre_Tax_Comm: req.body.Nav_Pre_Tax_Comm,
                NAV_Post_Tax_Comm: req.body.Nav_Post_Tax_Comm,
                ClientID: req.body.Id,
                TransactionDate: req.body.Date,
                Scheme_Name: req.body.SchemeName,
                CreatedBy: req.body.UserId,
                CreatedDate: connect.sequelize.fn("NOW"),
                Folio_No: req.body.Folio_No
            };

            console.log(values);
            dataaccess.Create(XIRR_Transactions, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'XIRR_Transactions Details saved successfully', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('XIRR_MasterSevice', 'SaveXIRRdetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });



        router.route('/GetAllXIRRdetails')
        .get(function (req, res) {
            const XIRR_Transactions = datamodel.XIRR_Transactions();

            var param = {
                attributes: ['T_Id', 'ClientID', 'Particulars', 'Units', 'NAV_Pre_Tax', 'NAV_Post_Tax', 'Commitment', 'NAV_Pre_Tax_Comm', 'NAV_Post_Tax_Comm',
                'Effective_tax_rate', 'Nifty50', 'TransactionDate', 'Scheme_Name', 'IsActive', 'CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy','Folio_No'],
                order: [['T_Id', 'DESC']],
            };

            dataaccess.FindAll(XIRR_Transactions, param)
                .then(function (result) {
                    if (result != null) {
              //          console.log(result);
                        res.status(200).json({ Success: true, Message: 'get XIRR_Transactions details Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of get XIRR_Transactions details', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('XIRR_MasterSevice', 'GetAllXIRRdetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of XIRR_Transactions Table', Data: null });
                });

        });


        router.route('/GetXIRRId/:Id')
        .get(function (req, res) {

            const XIRR_Transactions = datamodel.XIRR_Transactions();
            var param = { where: { T_Id: req.params.Id } };

            dataaccess.FindOne(XIRR_Transactions, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'XIRR_Transactions Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of XIRR_Transactions Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('XIRR_MasterSevice', 'GetXIRRId', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of XIRR_Transactions Table', Data: null });
                });

        });


        router.route('/GetClientName/:T_Id')
        .get(function (req, res) {

            const Client_Master = datamodel.Client_Master();
            var param = { where: { Id: req.params.T_Id } };

            dataaccess.FindOne(Client_Master, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Client_Master Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Client_Master Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('XIRR_MasterSevice', 'GetClientName', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Client_Master Table', Data: null });
                });

        });


        router.route('/UpdateXIRR')
        .post(function (req, res) {

            const XIRR_Transactions = datamodel.XIRR_Transactions();


            var values = {
                Particulars: req.body.Particulars,
                Units: req.body.Units,
                NAV_Pre_Tax: req.body.Nav_Pre_Tax,
                NAV_Post_Tax: req.body.Nav_Post_Tax,
                Commitment: req.body.Commitment,
                NAV_Pre_Tax_Comm: req.body.Nav_Pre_Tax_Comm,
                NAV_Post_Tax_Comm: req.body.Nav_Post_Tax_Comm,
                ClientID: req.body.Id,
                TransactionDate: req.body.Date,
                Scheme_Name: req.body.SchemeName,
                Folio_No: req.body.Folio_No,
                ModifiedBy: req.body.UserId,
                ModifiedDate: connect.sequelize.fn("NOW"),
                
            };
            var param = { T_Id: req.body.XIRRId };
            dataaccess.Update(XIRR_Transactions, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'XIRR_Transactions updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('XIRR_MasterSevice', 'UpdateXIRR', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('XIRR_MasterSevice', 'UpdateXIRR', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });


    return router;

};

module.exports = routes;