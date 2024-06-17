const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
var ejs = require('ejs');
const configFile = require('../Config');
// const puppeteer = require('puppeteer');

var connect = require('../Data/Connect');
var datamodel = require('../Data/DataModel');
var dataaccess = require('../Data/DataAccess');
var dataconn = require('../Data/DataConnection');


function bindDataToTemplate(template, data) {
  return ejs.render(template, data);
}

let transporter = nodemailer.createTransport({
  host: configFile.email_smtp_config.host,   //SMTP Host Address
  port: configFile.email_smtp_config.port,                 //SMTP PORT
  auth: {
    user: configFile.email_smtp_config.auth.user,   //Username
    pass: configFile.email_smtp_config.auth.pass    //Password
  }
});


//ejs ok function
// async function fetchHtmlContent(data) {
//   const Email_Tbl = datamodel.Email_Tbl();
//   try {
//     const result = await dataaccess.FindOne(Email_Tbl, { where: { IsActive: true } });

//     console.log('content', result);
//     if (result) {
//       console.log('result found');
//       // Extract required variables from result
      
//       const {
//         Transaction_Date_Time,
//         Value_Date,
//         Customers_AccountName,
//         Transaction_Branch_Name,
//         UTR_Ref_No,
//         AccountName,
//         TransactionAmount
//       } = data;

//       // Pass these variables to the template
//       const template = result.content; // Assuming 'content' is the column name
//       return bindDataToTemplate(template, {
//         Transaction_Date_Time,
//         Value_Date,
//         Customers_AccountName,
//         Transaction_Branch_Name,
//         UTR_Ref_No,
//         AccountName,
//         TransactionAmount
//       });
//     } else {
//       throw new Error('No HTML content found for the given transaction ID.');
//     }
//   } catch (error) {
//     console.error('Error fetching HTML content:', error);
//     throw error;
//   }
// }


async function fetchHtmlContent(data) {
  const Email_Tbl = datamodel.Email_Tbl();
  try {
    const result = await dataaccess.FindOne(Email_Tbl, { where: { IsActive: true } });

    console.log('content', result);
    if (result) {
      console.log('result found');
      // Extract required variables from result
      const {
        Transaction_Date_Time,
        Value_Date,
        Customers_AccountName,
        Transaction_Branch_Name,
        UTR_Ref_No,
        AccountName,
        TransactionAmount
      } = data;

      // Format Transaction_Date_Time to dd-mm-yyyy format
      // const formattedTransactionDate = new Date(Transaction_Date_Time).toLocaleDateString('en-GB');

      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      const formattedTransactionDate = formatter.format(new Date(Transaction_Date_Time));
      const currentDate = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });

      // Pass these variables to the template
      const template = result.content; // Assuming 'content' is the column name
    //   return bindDataToTemplate(template, {
    //     Transaction_Date_Time: formattedTransactionDate,
    //     Value_Date,
    //     Customers_AccountName,
    //     Transaction_Branch_Name,
    //     UTR_Ref_No,
    //     AccountName,
    //     currentDate,
    //     TransactionAmount
    //   });
    // }
    return {
      htmlContent: bindDataToTemplate(template, {
        Transaction_Date_Time: formattedTransactionDate,
        Value_Date,
        Customers_AccountName,
        Transaction_Branch_Name,
        UTR_Ref_No,
        AccountName,
        currentDate,
        TransactionAmount
      }),
      resultData: result // Return the entire result object
    };
  }
    else {
      throw new Error('No HTML content found for the given transaction ID.');
    }
  } catch (error) {
    console.error('Error fetching HTML content:', error);
    throw error;
  }
}


// function generateHtmlTable(data) {
//   let html = `
//   <p>Email for Fund receipt.</p>
//     <p>Hi Sir/Madam,</p>
//     <p>We have received below amount in our Neo Asset Management PMS account..</p>
//     <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
//       <thead>
//         <tr>
//         <th style="font-weight: normal;">Transaction Date</th>
//         <th style="font-weight: normal;">Fund Receipt Date</th>
//         <th style="font-weight: normal;">Credit Bank Details</th>
//         <th style="font-weight: normal;">Debits Bank Details</th>
//         <th style="font-weight: normal;">UTR Number</th>
//         <th style="font-weight: normal;">Name</th>
//         <th style="font-weight: normal;">Time Stamp</th>
//         <th style="font-weight: normal;">Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>${data.Transaction_Date_Time}</td>
//           <td>${data.Value_Date}</td>
//           <td>${data.Customers_AccountName}</td>
//           <td>${data.Transaction_Branch_Name}</td>
//           <td>${data.UTR_Ref_No}</td>
//           <td>${data.AccountName}</td>
//           <td>${data.Transaction_Date_Time}</td>
//           <td>${data.TransactionAmount}</td>
//         </tr>
//       </tbody>
//     </table>`;
//   return html;
// }


// async function fetchHtmlContent(data) {
//   const Email_Tbl = datamodel.Email_Tbl();
//   try {

//     const result = await dataaccess.FindOne(Email_Tbl, { where: { IsActive: true } });

//     console.log('content', result);
//     if (result) { // Check if result is truthy
//       console.log('result found');
//       const template = result.content; // Assuming 'content' is the column name
//       return bindDataToTemplate(template, data);
//     } else {
//       throw new Error('No HTML content found for the given transaction ID.');
//     }
//   } catch (error) {
//     console.error('Error fetching HTML content:', error);
//     throw error;
//   }
// }

module.exports.notifyMail = async function (fromEmail, toEmail, ccEmail, subjectEmail, htmlEmailTemplatePath, dataEmailTemplateBody, data) {
  try {
    console.log('notify mail..', data);
    //const htmlContent = await fetchHtmlContent(data);

    const { htmlContent, resultData } = await fetchHtmlContent(data);
    console.log('Email_Tbl result data:', resultData);

    console.log('from email', fromEmail);
    let messageData = {
      from: resultData.from,
      to: resultData.to,
      cc: resultData.cc,
      subject: resultData.subject,
      html: htmlContent,
      text: 'Hello, this is a test mail for NEO INSTA ALERT!'
    }



    transporter.sendMail(messageData, (err, info) => {
      const Email_Response_Tbl = datamodel.Email_Response_Tbl();
      var valuesmail = {
        Transaction_Date: data.Transaction_Date_Time,
        Fund_Receipt_Date: data.Value_Date,
        Credit_Bank_Details: data.Customers_AccountName,
        Debits_Bank_Details: data.Transaction_Branch_Name,
        UTR_Number: data.UTR_Ref_No,
        Name: data.AccountName,
        Time_Stamp: data.Transaction_Date_Time,
        Amount: data.TransactionAmount,
        from: resultData.from,//messageData.from,
        to: resultData.to,//messageData.to,
        cc: resultData.cc,//messageData.cc,
        subject: resultData.subject,//messageData.subject,
        text: messageData.text,
        Status: err ? '0' : '1'
      };

      console.log('values mail ', valuesmail);

      dataaccess.Create(Email_Response_Tbl, valuesmail)
        .then(function (mailiresul) {
          if (mailiresul != null) {
            // handle the response if necessary
          }
        });

      if (err) {
        reject({ messageData: messageData, err: err });
      } else {
        resolve({ messageData: messageData, info: info });
      }
    });
  } catch (error) {
    console.error('Error in notifyMail:', error);
    reject(error);
  }
}

// module.exports.notifyMail = function (fromEmail, toEmail, ccEmail, subjectEmail, htmlEmailTemplatePath, dataEmailTemplateBody, data) {

//   return new Promise((resolve, reject) => {
//     // const templateString = fs.readFileSync(htmlEmailTemplatePath,'utf-8');
//     // const HTMLTemplete = ejs.render(templateString,dataEmailTemplateBody);
//     const htmlContent = generateHtmlTable(data);

//     console.log('from email', fromEmail);
//     let messageData = {
//       from: fromEmail,//'Notification.Centre@Lightstorm.in',
//       to: toEmail,
//       cc: ccEmail,
//       subject: subjectEmail,
//       html: htmlContent,
//       text: 'Hello, this is a test mail for NEO INSTA ALERT!'
//       // html: HTMLTemplete
//     }

//     transporter.sendMail(messageData, (err, info) => {

//       if (err) {
//         let sentData = { messageData: messageData, err: err }
//         const Email_Response_Tbl = datamodel.Email_Response_Tbl();

//         var valuesmail = {

//           Transaction_Date: data.Transaction_Date_Time,
//           Fund_Receipt_Date: data.Value_Date,
//           Credit_Bank_Details: data.Customers_AccountName,
//           Debits_Bank_Details: data.Transaction_Branch_Name,
//           UTR_Number: data.UTR_Ref_No,
//           Name: data.AccountName,
//           Time_Stamp: data.Transaction_Date_Time,
//           Amount: data.TransactionAmount,
//           from: messageData.from,
//           to:   messageData.to,
//           cc: messageData.cc,
//           subject: messageData.subject,
//           text: messageData.text,
//           Status: '0'
//         }

//         console.log('values mail ', valuesmail);

//         dataaccess.Create(Email_Response_Tbl, valuesmail)
//           .then(function (mailiresul) {
//             if (mailiresul != null) {

//             }
//           })

//         reject(sentData);
//       }
//       else {
//         let sentData = { messageData: messageData, info: info }

//         const Email_Response_Tbl = datamodel.Email_Response_Tbl();

//         var valuesmail = {

//           Transaction_Date: data.Transaction_Date_Time,
//           Fund_Receipt_Date: data.Value_Date,
//           Credit_Bank_Details: data.Customers_AccountName,
//           Debits_Bank_Details: data.Transaction_Branch_Name,
//           UTR_Number: data.UTR_Ref_No,
//           Name: data.AccountName,
//           Time_Stamp: data.Transaction_Date_Time,
//           Amount: data.TransactionAmount,
//           from: messageData.from,
//           to:   messageData.to,
//           cc: messageData.cc,
//           subject: messageData.subject,
//           text: messageData.text,
//           Status: '1'
//         }

//         console.log('values mail ', valuesmail);

//         dataaccess.Create(Email_Response_Tbl, valuesmail)
//           .then(function (mailiresul) {
//             if (mailiresul != null) {

//             }
//           })

//         resolve(sentData);
//       }
//     });
//   });
// }






module.exports.sendSchedulerMailDynamicData = async function (Service, Obj, Subject, DynamicData) {
  return new Promise(async (resolve, reject) => {
    try {

      let EmailBodyTemplate = `
        <html>
                <head>
                    <style>
                        html * {
                            font-family: sans-serif;
                        }
      
                        a {
                            display: block;
                            width: 175px;
                            height: 25px;
                            background: #2049a6;
                            text-decoration: none;
                            padding: 10px;
                            text-align: center;
                            border-radius: 5px;
                            color: white;
                            font-weight: bold;
                            line-height: 25px;
                        }
      
                        img {
                            width: 200px;
                            height: 50px;
                            display: block;
                            margin-left: auto;
                            margin-right: auto;
                        }
      
                    </style>
                </head>
      
                <body>
                    <br>
                    <br>
 
                    <div>
                    <br>
                    <table style="border-collapse: collapse; width: 100%;">
                          <thead>
                            <tr>
                                <th style="border: 1px solid #000; padding: 8px;">Transaction Date</th>
                                <th style="border: 1px solid #000; padding: 8px;">Fund Receipt Date</th>
                                <th style="border: 1px solid #000; padding: 8px;">Credit Bank Details</th>
                                <th style="border: 1px solid #000; padding: 8px;">Debits Bank Details</th>
                                <th style="border: 1px solid #000; padding: 8px;">UTR Number</th>
                                <th style="border: 1px solid #000; padding: 8px;">Name</th>
                                <th style="border: 1px solid #000; padding: 8px;">Time Stamp</th>
                                <th style="border: 1px solid #000; padding: 8px;">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            
                              <tr>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.Transaction_Date_Time + `</td>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.value_date + `</td>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.init_br_name + `</td>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.utr_ref_num + `</td>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.acct_name + `</td>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.Transaction_Date_Time + `</td>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.tran_amount + `</td>
                                <td style="border: 1px solid #000; padding: 8px;">`+ DynamicData.tran_amount + `</td>
                              </tr>
                            
                          </tbody>
                      </table>
                      
                    </div>

                    <div>
                        <p>
                            Warm Regards,<br> <b>Team Neo</b>
                        </p>
                    </div>
                </body>
              </html>`;

      var data = JSON.stringify({
        "fromMail": configFile.Scheduler_Email_Details.data.fromMail,
        "toMail": configFile.Scheduler_Email_Details.data.toMail,
        "ccMail": configFile.Scheduler_Email_Details.data.ccMail,
        "bccMail": configFile.Scheduler_Email_Details.data.bccMail,
        // "replyTo": configFile.Scheduler_Email_Details.data.replyTo,
        //  "displayName": configFile.Scheduler_Email_Details.data.displayName,
        "subject": Subject,
        "body": EmailBodyTemplate,
        // "userId": configFile.Scheduler_Email_Details.data.userId,
        // "lob": configFile.Scheduler_Email_Details.data.lob,
        //  "application": configFile.Scheduler_Email_Details.data.application,
        //  "IsAttachment": false,
        // "Files": [
        //   {
        //     "fileName": "",
        //     "fileData": ""
        //   }
        // ]
      });

      transporter.sendMail(data, (err, info) => {
        if (err) {
          let sentData = { data: data, err: err }
          reject(sentData);
        }
        else {
          let sentData = { data: data, info: info }
          resolve(sentData);
        }
      });

      // var config = {
      //   method: configFile.Scheduler_Email_Details.config.method,
      //   url: configFile.Scheduler_Email_Details.config.url,
      //   headers: configFile.Scheduler_Email_Details.config.headers,
      //   data: data
      // };

      // let response = await axios(config);
      // console.log("sendSchedulerMail - response",response);
      // if(response.status == 200){
      //   resolve();
      // }
      //     else{
      //        dataconn.errorlogger('Mailer', 'sendSchedulerMail', { message: 'Error Occured', stack: 'Error Occured While Sending Email' });
      //   resolve();
      // }


    }
    catch (errorCatch) {
      // console.log("sendSchedulerMail - errorCatch", errorCatch);

      console.log('error', errorCatch);
      //    dataconn.errorlogger('Mailer', 'sendSchedulerMail', { message: 'Error Occured', stack: errorCatch });
      resolve();
    }
  });
}