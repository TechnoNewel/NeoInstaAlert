var connect = require('./Connect');

var sequelize = connect.sequelize;
var Sequelize = connect.Sequelize;
const Model = connect.Sequelize.Model;

//Model declaration starts
class Request_Tbl extends Model { }
class Email_Response_Tbl extends Model { }
class Email_Tbl extends Model { }
class Encryption_Request_Tbl extends Model { }
module.exports.Request_Tbl = function () {
    Request_Tbl.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        AccountName: { type: Sequelize.STRING(2000), allowNull: true },
        Account_for_Alerts_tobesent: { type: Sequelize.STRING(2000), allowNull: true },
        Value_Date: { type: Sequelize.DATE, allowNull: true },
        Transaction_Date_Time: { type: Sequelize.DATE, allowNull: true },
        Debit_Credit_Indicator: { type: Sequelize.STRING(2000), allowNull: true },
        Transaction_Mode: { type: Sequelize.STRING(2000), allowNull: true },
        TransactionAmount: { type: Sequelize.DOUBLE(18, 2), allowNull: true },
        Bank_Ref_No: { type: Sequelize.STRING(2000), allowNull: true },
        UTR_Ref_No: { type: Sequelize.STRING(2000), allowNull: true },
        Effective_Balance: { type: Sequelize.DOUBLE(18, 2), allowNull: true },
        Customers_AccountName: { type: Sequelize.STRING(2000), allowNull: true },
        Customers_AccountNo: { type: Sequelize.STRING(2000), allowNull: true },
        Customers_IFSC_Code: { type: Sequelize.STRING(2000), allowNull: true },
        Remarks: { type: Sequelize.STRING(2000), allowNull: true },
        Remarks_1: { type: Sequelize.STRING(2000), allowNull: true },
        Remarks_2: { type: Sequelize.STRING(2000), allowNull: true },
        Transaction_Branch_Code: { type: Sequelize.STRING(2000), allowNull: true },
        Transaction_Branch_Name: { type: Sequelize.STRING(2000), allowNull: true },
        iSurePay_ReferenceNo: { type: Sequelize.STRING(2000), allowNull: true },
        Part_Tran_Srl_No: { type: Sequelize.STRING(2000), allowNull: true },
        Currency: { type: Sequelize.STRING(2000), allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedOn: { type: Sequelize.DATE, allowNull: true },
        ModifiedOn: { type: Sequelize.DATE, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },

    },
        {
            sequelize,
            modelName: 'Request_Tbl',
            tableName: 'Request_Tbl',
        });

    return Request_Tbl;
}



module.exports.Email_Response_Tbl = function () {
    Email_Response_Tbl.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        Transaction_Date: { type: Sequelize.DATE, allowNull: true },
        Fund_Receipt_Date: { type: Sequelize.DATE, allowNull: true },
        Credit_Bank_Details: { type: Sequelize.STRING(2000), allowNull: true },
        Debits_Bank_Details: { type: Sequelize.STRING(2000), allowNull: true },
        UTR_Number: { type: Sequelize.STRING(2000), allowNull: true },
        Name: { type: Sequelize.STRING(2000), allowNull: true },
        Time_Stamp: { type: Sequelize.DATE, allowNull: true },
        Amount: { type: Sequelize.DOUBLE(18, 2), allowNull: true },
        from: { type: Sequelize.STRING(2000), allowNull: true },
        to: { type: Sequelize.STRING(2000), allowNull: true },
        cc: { type: Sequelize.STRING(2000), allowNull: true },
        subject: { type: Sequelize.STRING(2000), allowNull: true },
        text: { type: Sequelize.TEXT, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedOn: { type: Sequelize.DATE, allowNull: true },
        ModifiedOn: { type: Sequelize.DATE, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        Status: { type: Sequelize.BIGINT, allowNull: true },
    },
        {
            sequelize,
            modelName: 'Email_Response_Tbl',
            tableName: 'Email_Response_Tbl',
        });

    return Email_Response_Tbl;
}




module.exports.Email_Tbl = function () {
    Email_Tbl.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        from: { type: Sequelize.STRING(2000), allowNull: true },
        to: { type: Sequelize.STRING(2000), allowNull: true },
        cc: { type: Sequelize.STRING(2000), allowNull: true },
        subject: { type: Sequelize.STRING(2000), allowNull: true },
        text: { type: Sequelize.TEXT, allowNull: true },
        content: { type: Sequelize.TEXT, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedOn: { type: Sequelize.DATE, allowNull: true },
        ModifiedOn: { type: Sequelize.DATE, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        Status: { type: Sequelize.BIGINT, allowNull: true },
    },
        {
            sequelize,
            modelName: 'Email_Tbl',
            tableName: 'Email_Tbl',
        });

    return Email_Tbl;
}



module.exports.Encryption_Request_Tbl = function () {
    Encryption_Request_Tbl.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        encryptedData: { type: Sequelize.TEXT, allowNull: true },
        iv: { type: Sequelize.TEXT, allowNull: true },
        key: { type: Sequelize.TEXT, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedOn: { type: Sequelize.DATE, allowNull: true },
        ModifiedOn: { type: Sequelize.DATE, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        Status: { type: Sequelize.BIGINT, allowNull: true },
    },
        {
            sequelize,
            modelName: 'Encryption_Request_Tbl',
            tableName: 'Encryption_Request_Tbl',
        });

    return Encryption_Request_Tbl;
}
