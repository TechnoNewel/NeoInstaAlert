var dataconn = require('./Data/DataConnection');
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var config = require('./Config');

var validateToken = require('./Common/TokenValidation');
var validateSession = require('./Common/SessionValidation');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));



// const http = require('http');

// const https = require('https');

 

 

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/webdev2.neweltechnologies.in/privkey.pem', 'utf8');

// const certificate = fs.readFileSync('/etc/letsencrypt/live/webdev2.neweltechnologies.in/cert.pem', 'utf8');

// const ca = fs.readFileSync('/etc/letsencrypt/live/webdev2.neweltechnologies.in/chain.pem', 'utf8');

 

// const credentials = {

//         key: privateKey,

//         cert: certificate,

//         ca: ca

// };

 

 

 

// const httpServer = http.createServer(app);

// const httpsServer = https.createServer(credentials, app);

 

 

// var server = httpsServer.listen(config.service_port, function() {

//     var host = server.address().address;

//     var port = server.address().port;

//     var datetime = new Date();

//     var message = "Server :- " + host + " running on Port : - " + port + " Started at :- " + datetime;

//     console.log(message);

// });


///////


// CORS Middleware node.js package for connect express
app.use(function (req, res, next) {
	var menthods = "GET, POST";
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", menthods);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization,,jwt_token");
	if (!menthods.includes(req.method.toUpperCase())) {
		return res.status(200).json({});
	};
	next();
});

// const staticImageRootLocal = path.join(__dirname + '/public/');
// app.use(express.static(staticImageRootLocal));

// Service checking method
app.get("/api/sample", function (req, res) {
	res.status(200).json({ Success: true, Message: "Service Running", Data: null });
});

// Connection checking method
app.get("/api/CheckConnection", function (req, res) {
	dataconn.CheckConnection(res);
});

//Table creation Method
app.get("/api/CreateTable", function (reg, res) {
	dataconn.CreateTable(res);
});

var loginService = require('./Service/Login/LoginService')();
app.use("/api/login", loginService);

//app.all("/*", validateToken.verifyToken, validateSession.checkSession);


var menuService = require('./Service/Login/MenuService')();
app.use("/api/menu", menuService);

var errorlogService = require('./Service/ErrorLog/ErrorLogService')();
app.use("/api/errorlog", errorlogService);

var userService = require('./Service/UserManagement/UserService')();
app.use("/api/user", userService);

var homeService = require('./Service/Home/Home')()
app.use("/api/home", homeService)

var roleService = require('./Service/UserManagement/RoleService')();
app.use("/api/role", roleService);

var uiroleService = require('./Service/UserManagement/UIRoleService')();
app.use("/api/uirolemap", uiroleService);

var XIRRMaster = require('./Service/Master/XirrService')()
app.use("/api/XIRRMaster", XIRRMaster)

// var NewEmployee = require('./Service/NewEmployee/Newemployee')();
// app.use("/api/newemployee", NewEmployee);

var Company = require('./Service/CompanyRegistration/company')();
app.use("/api/company", Company);

var Branch = require('./Service/Branch/Branch_master')();
app.use("/api/BranchMaster",Branch)

var UploadService = require('./Service/UploadData/UploadService')()
app.use("/api/UploadService", UploadService);

// var DataApproval = require('./Service/DataApproval/DataApproval')()
// app.use("/api/DataApproval", DataApproval);

var DataApproval = require('./Service/DataApproval/DataApproval')()
app.use("/api/DataApproval", DataApproval);

var NewEmp = require('./Service/NewEmployee/NewEmp')();
app.use("/api/NewEmp", NewEmp);

var Emp_Closure_Sevice = require('./Service/Master/EmployeeClosure/EmployeeClosureService')();
app.use("/api/Emp_Closure_Sevice", Emp_Closure_Sevice);

var PaswordResetService = require('./Service/UserManagement/PasswordReset')();
app.use("/api/PaswordResetService", PaswordResetService);

var DataStatus = require('./Service/Master/DataStatus/DataStatusService')();
app.use("/api/DataStatus", DataStatus);

var NeoInstaAlert = require('./Service/NeoInstaAlert/NeoInstaAlertService')();
app.use("/api/NeoInstaAlertService", NeoInstaAlert);

var encrypt = require('./Service/NeoInstaAlert/EncryptionandDecryption')();
app.use("/api/encryptService", encrypt);

var decryptwithalert = require('./Service/NeoInstaAlert/DecryptwithAlert')();
app.use("/api/decryptwithalertService", decryptwithalert);
 
var Signature = path.join(__dirname + config.Uploads_Folder + config.Signature_Folder);
if (!fs.existsSync(Signature)) {
	fs.mkdirSync(Signature, { recursive: true });
}




var Signature = path.join(__dirname + config.Uploads_Folder + config.Signature_Folder);
if (!fs.existsSync(Signature)) {
	fs.mkdirSync(Signature, { recursive: true });
}



var server = app.listen(process.env.port || config.service_port, function () {
	var host = server.address().address;
	var port = server.address().port;
	var datetime = new Date();
	var message = "Server :- " + host + " running on Port : - " + port + " Started at :- " + datetime;
	console.log(message);
});