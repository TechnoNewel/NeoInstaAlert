const environmentConfig = {
    local: {
        // service_port: 1341,
        service_port: 1339,

        ui_url: 'http://localhost:4200/',
        JWT_Token_Key: 'randomStringabc',
        dbConn: {
            dbServer: 'dbdev1.neweltechnologies.in',
            // dbName: 'AIF_PMS_18Sept',
           //dbName: 'AIF_PMS_Dev',
           dbName: 'NEOCAT',
            dbUser: 'dbmasteruser',
            dbPassword: 'RO?[$#D8OkY_E~;2}[g&E5j7C:bJoB`P',
        }
    }

}

const email_smtp_config = {
   // host: "smtp.com",   //SMTP Host Address
   // port: 587,                 //SMTP PORT
    
   host: 'smtp.gmail.com',
   port: 587,
   secure: false,
   requireTLS: true,

   auth: {
         user: "newel.technical@gmail.com",   //Username
         pass: "cqcaiblynypipdun"    //Password

     // user: "khilarivishu@gmail.com",
     // pass: "bryz fxra xhgl ckkg"
    }
}




const environment = 'local'; 
const finalConfig = environmentConfig[environment];
const Uploads_Folder = '/Uploads'
const Signature_Folder = '/Signature'

const Closure_Folder = '/BranchDocument'
module.exports.service_port = finalConfig.service_port;
module.exports.ui_url = finalConfig.ui_url;
module.exports.api_url = finalConfig.api_url;
module.exports.dbConn = finalConfig.dbConn;
module.exports.email_smtp_config = email_smtp_config;
module.exports.Uploads_Folder = Uploads_Folder;
module.exports.Signature_Folder = Signature_Folder;
module.exports.Closure_Folder = Closure_Folder;
module.exports.JWT_Token_Key = finalConfig.JWT_Token_Key;



//SQL AND Pg config for data migration
module.exports.Sql_Config
    = {
    user: 'rd_user_newel',

    server: '10.224.71.88',
    database: 'TASKMGR',
    password: 'rd_user_newel~',
    // domain: 'WORKGROUP',

    options: {
        trustServerCertificate: true,

        trustedConnection: true,
        integratedsecurity: true
    },
    port: 1435

}

// Live CIP creds
module.exports.Sql_Config_Prod
    = {

    // user: 'rd_user_newel', //UAT
    // server: '10.224.71.88', //UAT
    // database: 'TASKMGR', //UAT
    // password: 'rd_user_newel~', //UAT
    // domain: 'WORKGROUP', //UAT

    user: 'rd_user_newel', //PROD
    server: '10.224.79.107', //PROD
    database: 'TASKMGR', //PROD
    password: 'rd_user_newel~', //PROD
    // domain: 'WORKGROUP',

    options: {
        trustServerCertificate: true,
        trustedConnection: true,
        integratedsecurity: true
    },
    // port: 1435, //UAT
    port: 1433, //PROD
    

}





module.exports.Scheduler_Email_Details = {
    config:{
        method: 'post',
        // url: 'https://pinpointuat.nuvamapis.com/api/mail/sendmail', //UAT
       // url: 'https://pinpoint.nuvamapis.com/api/mail/sendmail', //PROD
        headers: { 
            'accesskey': 'TMyqOXnsYxDrHOHzkNPBDN+YVE+TQT9/xvQWv8Es/ZQ=', 
            'Content-Type': 'application/json'
        }
    },
    data:{
        fromMail:"Bhushan.c@neweltechnologies.com",
        toMail: "Bhushan.c@neweltechnologies.com",
        ccMail: "",
        bccMail: "",
        replyTo: "",
        displayName: "",
        subject: "",
       
    }
}
