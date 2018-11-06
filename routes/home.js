const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
  console.log('Root Page')
  res.send('Root Page')
});

module.exports = router;
