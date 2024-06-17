var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
const forge = require('node-forge');
const { notifyMail } = require('../../Common/Mailer')
var mailer = require('../../Common/Mailer');
var routes = function () {

    const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);

    // Function to encrypt data using RSA - ECB - PKCS1 Padding
    function encryptData(publicKey, data) {
        const encryptedData = {};
        for (const key in data) {
            const value = data[key];
            const encryptedValue = publicKey.encrypt(value, 'RSAES-PKCS1-V1_5');
            encryptedData[key] = forge.util.encode64(encryptedValue);
        }
        return encryptedData;
    }

    // function decryptData(privateKey, encryptedData) {
    //     const decryptedData = {};
    //     for (const key in encryptedData) {
    //         const encryptedValue = forge.util.decode64(encryptedData[key]);
    //         const decryptedValue = privateKey.decrypt(encryptedValue, 'RSAES-PKCS1-V1_5');
    //         decryptedData[key] = decryptedValue;
    //     }
    //     return decryptedData;
    // }

    function decryptData(privateKey, encryptedData) {
        const decryptedData = {};
        for (const key in encryptedData) {
            const encryptedValue = forge.util.decode64(encryptedData[key]);
            const decryptedValue = privateKey.decrypt(encryptedValue, 'RSAES-PKCS1-V1_5');
            decryptedData[key] = decryptedValue;
        }
        return decryptedData;
    }




    router.route('/RequestApi')
        .post(function (req, res) {


            function convertToISODate(dateString) {
                const [day, month, year] = dateString.split('-');
                return new Date(`${year}-${month}-${day}`).toISOString().slice(0, 10);
            }

            function convertToISODateTime(dateTimeString) {
                const [datePart, timePart] = dateTimeString.split(' ');
                const [day, month, year] = datePart.split('-');
                const formattedDate = `${year}-${month}-${day}T${timePart}`;
                return new Date(formattedDate).toISOString();
            }

            const Request_Tbl = datamodel.Request_Tbl();

            var values = {

                AccountName: req.body.acct_name,
                Account_for_Alerts_tobesent: req.body.foracid,
                Value_Date: convertToISODate(req.body.value_date),
                Transaction_Date_Time: convertToISODateTime(req.body.dtd_vfd_date),
                Debit_Credit_Indicator: req.body.drcr_ind,
                Transaction_Mode: req.body.tran_mode,
                TransactionAmount: req.body.tran_amount,
                Bank_Ref_No: req.body.tran_id,
                UTR_Ref_No: req.body.utr_ref_num,
                Effective_Balance: req.body.balance,
                Customers_AccountName: req.body.party_name,
                Customers_AccountNo: req.body.party_account_num,
                Customers_IFSC_Code: req.body.ifsc_code,
                Remarks: req.body.tran_particular,
                Remarks_1: req.body.tran_particular2,
                Remarks_2: req.body.tran_rmks,
                Transaction_Branch_Code: req.body.init_sol_id,
                Transaction_Branch_Name: req.body.init_br_name,
                iSurePay_ReferenceNo: req.body.iSurePayrefNo,
                Part_Tran_Srl_No: req.body.part_tran_srl_num,
                Currency: req.body.tran_crncy_code,
                CreatedOn: connect.sequelize.fn("NOW")
            }

            // var values = {

            //     acct_name: req.body.acct_name,
            //     foracid: req.body.foracid,
            //     value_date: req.body.value_date,
            //     dtd_vfd_date: req.body.dtd_vfd_date,//convertToISODate(req.body.dtd_vfd_date),
            //     drcr_ind: req.body.drcr_ind,
            //     tran_mode: req.body.tran_mode,
            //     tran_amount: req.body.tran_amount,
            //     tran_id: req.body.tran_id,
            //     utr_ref_num: req.body.utr_ref_num,
            //     balance: req.body.balance,
            //     party_name: req.body.party_name,
            //     party_account_num: req.body.party_account_num,
            //     ifsc_code: req.body.ifsc_code,
            //     tran_particular: req.body.tran_particular,
            //     tran_particular2: req.body.tran_particular2,
            //     tran_rmks: req.body.tran_rmks,
            //     init_sol_id: req.body.init_sol_id,
            //     init_br_name: req.body.init_br_name,
            //     iSurePayrefNo: req.body.iSurePayrefNo,
            //     part_tran_srl_num: req.body.part_tran_srl_num,
            //     tran_crncy_code: req.body.tran_crncy_code,
            // }
            console.log('request api', values);

            //     const encryptedData = encryptData(publicKey, values);

            //    console.log('Encrypted request data:', encryptedData);

            // const decryptedData = decryptData(privateKey, values);
            // console.log('Decrypted request data:', decryptedData);

            //     const encryptedDataFromAPI = req.body; // Assuming the encrypted data is received in the request body

            // // Decrypt the received encrypted data
            // const decryptedData = decryptData(privateKey, encryptedDataFromAPI);

            // console.log('Decrypted response data:', decryptedData);


            dataaccess.Create(Request_Tbl, values)
                .then(function (result) {
                    if (result != null) {

                        const fromEmail = 'Bhushan.c@neweltechnologies.com';
                        const toEmail = 'Bhushan.c@neweltechnologies.com';
                        const ccEmail = '';
                        const subjectEmail = 'NEO INSTA ALERT';
                        const htmlEmailTemplatePath = '';
                        const dataEmailTemplateBody = 'NEW INSTA ALERT MAIL TESTING';

                        //       mailer.sendSchedulerMailDynamicData('Neo Insta Alert', '', '',values);

                        // const Email_Response_Tbl = datamodel.Email_Response_Tbl();

                        // var valuesmail = {

                        //     Transaction_Date: values.Transaction_Date_Time,
                        //     Fund_Receipt_Date: values.Value_Date,
                        //     Credit_Bank_Details: values.Customers_AccountName,
                        //     Debits_Bank_Details: values.Transaction_Branch_Name,
                        //     UTR_Number: values.UTR_Ref_No,
                        //     Name: values.AccountName,
                        //     Time_Stamp: values.Transaction_Date_Time,
                        //     Amount: values.TransactionAmount,
                        //     from: result.messageData.from,
                        //     to: result.messageData.to,
                        //     cc: result.messageData.cc,
                        //     subject: result.messageData.subject,
                        //     text: result.messageData.text
                        // }

                        // console.log('values mail ', valuesmail);

                        // dataaccess.Create(Email_Response_Tbl, valuesmail)
                        //     .then(function (mailiresul) {
                        //         if (mailiresul != null) {

                        //         }
                        //     })


                        notifyMail(fromEmail, toEmail, ccEmail, subjectEmail, htmlEmailTemplatePath, dataEmailTemplateBody, values)
                            .then(result => {
                                console.log('Email sent successfully:', result);
                                //     const htmlContent = generateHtmlTable(values);


                            })
                            .catch(error => {
                                console.error('Error sending email:', error);
                            });

                        res.status(200).json({ Status: 'Accept', Remarks: 'Transaction Updated Successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Status: 'Reject', Remarks: 'Error occurred while Transaction Update', Data: result });
                    }
                }
                    ,
                    function (err) {
                        console.log("error ", err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: err, values });
                    }
                );
            //res.status(200).json({ Success: true, Message: 'Record get successfully', Data: req.body });
        });

    return router;

};

module.exports = routes;
