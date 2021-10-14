const path = require('path')
const nodemailer = require ('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const {host, port, user, pass} = require ('../config/mail.json')

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {user, pass},
});
transport.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

/*transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}))*/

module.exports = transport;