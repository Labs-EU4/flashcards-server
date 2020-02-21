const port = process.env.PORT || 4003;
const SECRET = process.env.SECRET || 'A very secure secret';
const senderEmail = process.env.NODEMAILER_EMAIL_ADDRESS;
const password = process.env.NODEMAILER_EMAIL_PASSWORD;
const BACKEND_HOST = process.env.HOST;
const frontEndSite =
  process.env.FRONTEND_SITE || `https://site.quickdecksapp.com/`;
const EMAIL_SECRET = process.env.EMAIL_SECRET || `emailSecret`;
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_FRONTEND_REDIRCT,
  GOOGLE_BACKEND_BASEURL,
} = process.env;

module.exports = {
  port,
  SECRET,
  senderEmail,
  password,
  BACKEND_HOST,
  frontEndSite,
  EMAIL_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_FRONTEND_REDIRCT,
  GOOGLE_BACKEND_BASEURL,
};
