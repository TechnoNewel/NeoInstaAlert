var connect = require('./Connect');
var datamodel = require('./DataModel');
var dataaccess = require('./DataAccess');

/// CheckConnection function used to check a database connection using API
module.exports.CheckConnection = function (res) {
    connect.sequelize
        .authenticate()
        .then(function (result) {
            res.status(200).json({ Success: true, Message: 'Connection has been establised successfully', Data: null });
        }, function (err) {
            res.status(200).json({ Success: false, Message: 'Unable to connect to the database : ' + err, Data: null });
        });
}

/// CreateTable function used to create Database tables using API
module.exports.CreateTable = function (res) {

    datamodel.Request_Tbl();
    datamodel.Email_Response_Tbl();
    datamodel.Email_Tbl();
    datamodel.Encryption_Request_Tbl();
    connect.sequelize.sync()
        .then(() => {
            res.status(200).json({ Success: true, Message: 'Tables Created Successfully', Data: null });
        })
}

/// errorlogger function used to insert error logs into Error log table
module.exports.errorlogger = function (servicename, functionname, errorobj) {

    var err = 'Message : ' + errorobj.message + '\n' + 'Stack : ' + errorobj.stack;

    var values = {
        ServiceName: servicename,
        FunctionName: functionname,
        ErrorObject: err
    };

    dataaccess.Create(datamodel.ErrorLog(), values)
        .then(function (result) {
            console.log(JSON.stringify(result));
        }, function (err) {
            console.log('Error: ' + JSON.stringify(err));
        });
}