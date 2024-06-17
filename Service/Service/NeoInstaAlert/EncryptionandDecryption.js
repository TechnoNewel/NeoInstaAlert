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


//
var routes = function () {




//     router.route('/EncryptionApi')
//         .post(function (req, res) {


//             console.log('req.body', req.body);


//             const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//                 modulusLength: 4096,
//                 publicKeyEncoding: {
//                   type: 'pkcs1',
//                   format: 'pem'
//                 },
//                 privateKeyEncoding: {
//                   type: 'pkcs1',
//                   format: 'pem'
//                 }
//               });
              
//               // Function to encrypt using RSA public key
//               function rsaEncrypt(data, publicKey) {
//                 const encryptedData = crypto.publicEncrypt(
//                   {
//                     key: publicKey,
//                     padding: crypto.constants.RSA_PKCS1_PADDING
//                   },
//                   Buffer.from(data)
//                 );
//                 return encryptedData.toString('base64');
//               }
              
// //              console.log('private key',privateKey);
//               // Function to decrypt using RSA private key

//               function rsaDecrypt(encryptedData, privateKey) {
//                 const decryptedData = crypto.privateDecrypt(
//                   {
//                     key: privateKey,
//                     padding: crypto.constants.RSA_PKCS1_PADDING
//                   },
//                   Buffer.from(encryptedData, 'base64')
//                 );
//                 return decryptedData.toString();
//               }
              
//               // Encrypting data
//   //            const plaintext = 'Hello, RSA!';
//               const plaintext = `{
//                 acct_name: 'abc',
//                 foracid: '01100035359',
//                 value_date: '28-05-2024',
//                 dtd_vfd_date: '28-05-2024 15:30:45',
//                 drcr_ind: 'C',
//                 tran_mode: 'RTGS',
//                 tran_amount: '12.00',
//                 tran_id: 'M999999999',
//                 utr_ref_num: '01100035359',
//                 balance: '11.00',
//                 party_name: 'ABC',
//                 party_account_num: '01100035359',
//                 ifsc_code: '01100035359',
//                 tran_particular: 'TEST1',
//                 tran_particular2: 'TEST2',
//                 tran_rmks: 'TEST3',
//                 init_sol_id: '1234',
//                 init_br_name: 'ABC',
//                 iSurePayrefNo: '01100035359',
//                 part_tran_srl_num: '12',
//                 tran_crncy_code: 'INDIA'
//               }`
             
//               console.log('Plaintext length:', Buffer.from(plaintext).length);

//               const ciphertext = rsaEncrypt(plaintext, publicKey);
//               console.log('Encrypted:', ciphertext);
              
//               // Decrypting data
//               const decryptedText = rsaDecrypt(ciphertext, privateKey);
//               console.log('Decrypted:', decryptedText);

//             res.status(200).json({ Success: true, Message: 'Record get successfully', Data: privateKey });
//         });

//ok code enry
// router.route('/EncryptionApi')
//   .post(function (req, res) {
//     const data = req.body;

//     const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//       modulusLength: 4096,
//       publicKeyEncoding: {
//         type: 'pkcs1',
//         format: 'pem'
//       },
//       privateKeyEncoding: {
//         type: 'pkcs1',
//         format: 'pem'
//       }
//     });

//     console.log('Generated Public Key:', publicKey);
//     console.log('Generated Private Key:', privateKey);

//     const plaintext = JSON.stringify(data);

//     // Function to encrypt data using AES
//     function aesEncrypt(data, key) {
//       const iv = crypto.randomBytes(16);
//       const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//       let encrypted = cipher.update(data, 'utf8', 'base64');
//       encrypted += cipher.final('base64');
//       return {
//         iv: iv.toString('base64'),
//         data: encrypted
//       };
//     }

//     // Function to encrypt AES key using RSA public key
//     function rsaEncrypt(data, publicKey) {
//       const encryptedData = crypto.publicEncrypt(
//         {
//           key: publicKey,
//           padding: crypto.constants.RSA_PKCS1_PADDING
//         },
//         Buffer.from(data)
//       );
//       return encryptedData.toString('base64');
//     }

//     try {
//       const aesKey = crypto.randomBytes(32);
//       const aesEncrypted = aesEncrypt(plaintext, aesKey);
//       const rsaEncryptedAesKey = rsaEncrypt(aesKey, publicKey);

//       res.status(200).json({
//         encryptedData: aesEncrypted.data,
//         iv: aesEncrypted.iv,
//         encryptedKey: rsaEncryptedAesKey,
//         privateKey: privateKey  // Return the private key for decryption
//       });
//     } catch (error) {
//       res.status(500).json({ error: 'Encryption failed', details: error.message });
//     }
//   });


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



  
        //   router.route('/DecryptionApi')
        //   .post(function (req, res) {
  
  
        //       console.log('req.body', req.body);

        //       function rsaDecrypt(encryptedData, privateKey) {
        //         const decryptedData = crypto.privateDecrypt(
        //           {
        //             key: privateKey,
        //             padding: crypto.constants.RSA_PKCS1_PADDING
        //           },
        //           Buffer.from(encryptedData, 'base64')
        //         );
        //         return decryptedData.toString();
        //       }
  
        //       const encryptedData = req.body.encryptedData;
        //       const privateKey = req.body.privateKey;
  
        //       console.log('Received private key:', privateKey);

        //       if (!encryptedData || !privateKey) {
        //         return res.status(400).json({ error: 'Encrypted data and private key are required.' });
        //       }
              
        //       try {
        //         const decryptedText = rsaDecrypt(encryptedData, privateKey);
        //         res.json({ decryptedText });
        //       } catch (error) {
        //         res.status(500).json({ error: 'Failed to decrypt data.',error });
        //       }
        //       //res.status(200).json({ Success: true, Message: 'Record get successfully', Data: req.body });
        //   });
  
//ok code
//         router.route('/DecryptionApi')
//   .post(function (req, res) {
//     const { encryptedData, iv, encryptedKey, privateKey } = req.body;

//     if (!encryptedData || !iv || !encryptedKey || !privateKey) {
//       return res.status(400).json({ error: 'Encrypted data, IV, encrypted key, and private key are required.' });
//     }

//     // Function to decrypt AES key using RSA private key
//     function rsaDecrypt(encryptedData, privateKey) {
//       const decryptedData = crypto.privateDecrypt(
//         {
//           key: privateKey,
//           padding: crypto.constants.RSA_PKCS1_PADDING
//         },
//         Buffer.from(encryptedData, 'base64')
//       );
//       return decryptedData;
//     }

//     // Function to decrypt data using AES
//     function aesDecrypt(encryptedData, key, iv) {
//       const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
//       let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
//       decrypted += decipher.final('utf8');
//       return decrypted;
//     }

//     try {
//       const aesKey = rsaDecrypt(encryptedKey, privateKey);
//       const decryptedText = aesDecrypt(encryptedData, aesKey, iv);
//       console.log('decrypted text', decryptedText);
//       res.json({ decryptedText });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to decrypt data.', details: error.message });
//     }
//   });


router.route('/DecryptionApi')
  .post(function (req, res) {
   // console.log('req.body',req.body);
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
      res.json({ decryptedText });
    } catch (error) {
      res.status(500).json({ error: 'Failed to decrypt data.', details: error.message });
    }
  });
  
    return router;

};

module.exports = routes;





// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048,
//     publicKeyEncoding: {
//       type: 'pkcs1',
//       format: 'pem'
//     },
//     privateKeyEncoding: {
//       type: 'pkcs1',
//       format: 'pem'
//     }
//   });
  
//   // Function to encrypt using RSA public key
//   function rsaEncrypt(data, publicKey) {
//     const encryptedData = crypto.publicEncrypt(
//       {
//         key: publicKey,
//         padding: crypto.constants.RSA_PKCS1_PADDING
//       },
//       Buffer.from(data)
//     );
//     return encryptedData.toString('base64');
//   }
  
//   console.log('private key',privateKey);
//   // Function to decrypt using RSA private key
//   function rsaDecrypt(encryptedData, privateKey) {
//     const decryptedData = crypto.privateDecrypt(
//       {
//         key: privateKey,
//         padding: crypto.constants.RSA_PKCS1_PADDING
//       },
//       Buffer.from(encryptedData, 'base64')
//     );
//     return decryptedData.toString();
//   }
  
//   // Encrypting data
//   const plaintext = 'Hello, RSA!';
//   const ciphertext = rsaEncrypt(plaintext, publicKey);
//   console.log('Encrypted:', ciphertext);
  
//   // Decrypting data
//   const decryptedText = rsaDecrypt(ciphertext, privateKey);
//   console.log('Decrypted:', decryptedText);
