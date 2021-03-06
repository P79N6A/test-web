// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});


app.listen(80, () => console.log('Example app listening on port 80!'))
