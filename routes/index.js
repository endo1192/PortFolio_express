var express = require('express');
var router = express.Router();
var path = require('path');

require('dotenv').config(); // 追加
var nodemailer = require('nodemailer');


// 静的ファイルの提供
router.use(express.static(path.join(__dirname, '..', 'views', 'build')));

/* GET home page. */
router.get('/', function(req, res, next) {
  const filePath = path.join(__dirname, '..', 'views', 'build', 'index.html');
  res.sendFile(filePath, function(err) {
    if (err) {
      console.log('Error sending file:', err);
      next(err);
    }
  });
});


/* POST mailform */
/*router.post('/mailform', (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Request Body:', req.body);

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const question = req.body.question;
  
  console.log(`FirstName: ${firstName}`);
  console.log(`LastName: ${lastName}`);
  console.log(`Question: ${question}`);
  
  // その他の処理
  res.send("Form received");
});*/

router.post('/mailform', async (req, res) => {
  console.log(req.body); // 受信したデータを表示

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const question = req.body.question;
  
  console.log(`FirstName: ${firstName}`);
  console.log(`LastName: ${lastName}`);
  console.log(`Question: ${question}`);

  // Nodemailerの設定
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // メールのオプション設定
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    subject: 'New Form Submission',
    text: `FirstName: ${firstName}\nLastName: ${lastName}\nQuestion: ${question}`
  };

  // メール送信
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.send("Form received and email sent");
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send("Failed to send email");
  }
});

module.exports = router;
