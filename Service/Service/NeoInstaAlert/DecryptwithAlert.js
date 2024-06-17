var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
const forge = require('node-forge');
const { notifyMail } = require('../../Common/Mailer')
var mailer = require('../../Common/Mailer');
const NodeRSA = require('node-rsa');

const crypto = require('crypto');
const basicAuth = require('basic-auth');

//
var routes = function () {

    router.route('/EncryptionApi')
        .post(function (req, res) {
            const data = req.body;
            const plaintext = JSON.stringify(data);

            // Function to encrypt data using AES
            function aesEncrypt(data, key) {
                const iv = crypto.randomBytes(16); // Initialization vector
                const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
                let encrypted = cipher.update(data, 'utf8', 'base64');
                encrypted += cipher.final('base64');
                return {
                    iv: iv.toString('base64'),
                    data: encrypted
                };
            }

            try {
                const aesKey = crypto.randomBytes(32); // AES-256 key (32 bytes)
                const aesEncrypted = aesEncrypt(plaintext, aesKey);

                res.status(200).json({
                    encryptedData: aesEncrypted.data,
                    iv: aesEncrypted.iv,
                    key: aesKey.toString('base64')  // Return the AES key for decryption
                });
            } catch (error) {
                res.status(500).json({ error: 'Encryption failed', details: error.message });
            }
        });


    // router.route('/DecryptionApi')
    //     .post(function (req, res) {
    // console.log('req.body',req.body);

    const USERNAME = 'NEO';
    const PASSWORD = 'NEOINSTA@2024';
    const SECRET_KEY = 'NEWEL';

    // Middleware for Basic Authentication and Secret Key verification
    const authMiddleware = (req, res, next) => {
        const user = basicAuth(req);

        if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const secretKey = req.headers['secret-key'];

        if (!secretKey || secretKey !== SECRET_KEY) {
            return res.status(401).json({ error: 'Invalid Secret Key' });
        }

        next();
    };


    router.route('/DecryptionApi')
        .post(authMiddleware, function (req, res) {



            console.log('req.body', req.body);
            const Encryption_Request_Tbl = datamodel.Encryption_Request_Tbl();

            var valuesEn = {

                encryptedData: req.body.encryptedData,
                iv: req.body.iv,
                key: req.body.key,
                CreatedOn: connect.sequelize.fn("NOW")
            }

            console.log('request valuesEn', valuesEn);


            dataaccess.Create(Encryption_Request_Tbl, valuesEn)
                .then(function (ret) {

                }
                )


            const { encryptedData, iv, key } = req.body;

            if (!encryptedData || !iv || !key) {
                return res.status(400).json({ error: 'Encrypted data, IV, and key are required.' });
            }

            // Function to decrypt data using AES
            function aesDecrypt(encryptedData, key, iv) {
                const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), Buffer.from(iv, 'base64'));
                let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            }

            try {
                const decryptedText = aesDecrypt(encryptedData, key, iv);
                console.log('decrypted text', decryptedText);

                //alert code start

                let parsedText;
                try {
                    parsedText = JSON.parse(decryptedText);
                } catch (error) {
                    console.error('Error parsing decrypted text:', error);
                    // Handle error (e.g., return or throw)
                    return;
                }

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

                    AccountName: parsedText.acct_name,
                    Account_for_Alerts_tobesent: parsedText.foracid,
                    Value_Date: convertToISODate(parsedText.value_date),
                    Transaction_Date_Time: convertToISODateTime(parsedText.dtd_vfd_date),
                    // Value_Date: parsedText.value_date,
                    // Transaction_Date_Time: parsedText.dtd_vfd_date,
                    Debit_Credit_Indicator: parsedText.drcr_ind,
                    Transaction_Mode: parsedText.tran_mode,
                    TransactionAmount: parsedText.tran_amount,
                    Bank_Ref_No: parsedText.tran_id,
                    UTR_Ref_No: parsedText.utr_ref_num,
                    Effective_Balance: parsedText.balance,
                    Customers_AccountName: parsedText.party_name,
                    Customers_AccountNo: parsedText.party_account_num,
                    Customers_IFSC_Code: parsedText.ifsc_code,
                    Remarks: parsedText.tran_particular,
                    Remarks_1: parsedText.tran_particular2,
                    Remarks_2: parsedText.tran_rmks,
                    Transaction_Branch_Code: parsedText.init_sol_id,
                    Transaction_Branch_Name: parsedText.init_br_name,
                    iSurePay_ReferenceNo: parsedText.iSurePayrefNo,
                    Part_Tran_Srl_No: parsedText.part_tran_srl_num,
                    Currency: parsedText.tran_crncy_code,
                    CreatedOn: connect.sequelize.fn("NOW")
                }

                console.log('request api', values);


                dataaccess.Create(Request_Tbl, values)
                    .then(function (result) {
                        if (result != null) {

                            const fromEmail = 'Bhushan.c@neweltechnologies.com';
                            const toEmail = 'Bhushan.c@neweltechnologies.com';
                            const ccEmail = '';
                            const subjectEmail = 'NEO INSTA ALERT';
                            const htmlEmailTemplatePath = '';
                            const dataEmailTemplateBody = 'NEW INSTA ALERT MAIL TESTING';

                            notifyMail(fromEmail, toEmail, ccEmail, subjectEmail, htmlEmailTemplatePath, dataEmailTemplateBody, values)
                                .then(result => {
                                    console.log('Email sent successfully:', result);
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


                //alert code end 


                //  res.json({ decryptedText });
            } catch (error) {
                res.status(500).json({ error: 'Failed to decrypt data.', details: error.message });
            }
        });

    return router;

};

module.exports = routes;
