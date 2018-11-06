const express = require('express')
const router = express.Router()

// Message Handelings
const handlePrivateMessage = require('../controllers/message/private');

router.get('/', (req, res) => {
  console.log('Webhook Route');
  res.send('Webhook Route');
});

router.post('/', (req, res) => {
  res.sendStatus(200);

  if (req.body.message) {
    let messageEvent = req.body.message;
    let sender = messageEvent.chat.id;
    let message_type = messageEvent.chat.type;

    if (message_type == 'private') {
      handlePrivateMessage(sender, messageEvent)
    }
  }
});

module.exports = router;
