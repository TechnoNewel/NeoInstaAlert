var Sequelize = require('sequelize');
var connect = require('../Data/Connect');
var datamodel = require('../Data/DataModel');
var dataaccess = require('../Data/DataAccess');
var dataconn = require('../Data/DataConnection');

        async function getMaxBranchId(branchcode) {
            const AP_Draft_Branch_Details = datamodel.AP_Draft_Branch_Details();
            var param = {
                where:{
                    Branch_Code: branchcode,
                    Process_Id:1
                },
                attributes: [
                    [Sequelize.fn('MAX', Sequelize.col('Id')), "Id"],
                    "AP_Code"
                ],
                group:["Id","AP_Code"],
                order:[['Id', 'DESC']],
                raw: true
            };
            try {
                let data = await dataaccess.FindOne(AP_Draft_Branch_Details, param);
                return data;
            }
            catch (error) {
                return error;
            }
        }

        module.exports={
            getMaxBranchId:getMaxBranchId
        }