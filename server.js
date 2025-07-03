const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/get-rates', async (req, res) => {
  const { zip, weight, length, width, height, value } = req.body;

  try {
    const response = await fetch('https://api.goshippo.com/rates/', {
      method: 'POST',
      headers: {
        'Authorization': 'ShippoToken shippo_live_5a8c7761f47e64baa90e9d7894785bbe90cb57b5',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address_from: {
          name: "CJS Automation",
          street1: "Newlands Grange",
          city: "Rugeley",
          zip: "WS15 3JD",
          country: "GB"
        },
        address_to: {
          zip: zip,
          country: /^\d+$/.test(zip) ? "US" : "GB"
        },
        parcel: {
