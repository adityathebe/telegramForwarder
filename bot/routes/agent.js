const express = require('express')
const router = express.Router();

router.get("/", (req, res) => {
  console.log('Agent Route');
  res.send('Agent Route');
});

module.exports = router;
