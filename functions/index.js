// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

// [START functionsimport]
const functions = require('firebase-functions');
const express = require('express');
const matchMock = require('./matchMock');
const app = express();

app.use(matchMock);

exports.api = functions.https.onRequest(app);
