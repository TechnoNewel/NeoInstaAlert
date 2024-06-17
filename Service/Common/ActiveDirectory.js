var ActiveDirectory = require('activedirectory');

var config = {

    url: 'ldap://gc.edelcap.com',
    baseDN: 'dc=edelcap,dc=com',
    username: 'bsgauth@edelcap.com',
    password: 'edelcap2005',
    attributes: {
        user: [
            'dn',                   //Domain details
            'userPrincipalName',    //Login Id with @EDELCAP.COM    
            'sAMAccountName',       //Login Id
            'title',                //Designation
            'mail',                 //Email Id
            'company',              //Entity
            'extensionattribute1',  //SBU
            'extensionattribute7',  //LOB
            'extensionattribute5',  //Sub LOB
            'description',          //Employee Code
            'sn',                   //Last Name
            'givenName',            //First Name
            'cn',                   //Full Name
            'displayName',          //Full name with SBU
            'manager'               //RA details
        ],
        group : ['dn', 'objectCategory', 'cn', 'description', 'groupType', 'anotherCustomAttribute']
    }
}

var ad = new ActiveDirectory(config);

module.exports = ad;