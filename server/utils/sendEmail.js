const axios = require('axios');

const sendEmail = async (options) => {
  try {
    const postData = {
      From: 'tolga@sterna.app',
      To: options.to,
      Subject: options.subject,
      TextBody: options.text,
      HtmlBody: options.text,
      MessageStream: 'outbound',
    };

    const response = await axios.post('https://api.postmarkapp.com/email', postData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.Postmark_Token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response.data);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;