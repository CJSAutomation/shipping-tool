const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

app.post('/get-rates', async (req, res) => {
  try {
    const { zip, weight, length, width, height, value } = req.body;

    const response = await fetch('https://api.goshippo.com/shipments/', {
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
          country: zip.match(/^\d+$/) ? "US" : "GB"
        },
        parcels: [
          {
            length: length,
            width: width,
            height: height,
            distance_unit: "cm",
            weight: weight,
            mass_unit: "kg"
          }
        ],
        insurance_amount: value,
        insurance_currency: "GBP",
        async: false
      })
    });

    if (!response.ok) throw new Error(`Shippo error: ${response.statusText}`);
    
    const shipment = await response.json();
    const shipmentId = shipment.object_id;

    const ratesResponse = await fetch(`https://api.goshippo.com/shipments/${shipmentId}/rates/`, {
      method: 'GET',
      headers: {
        'Authorization': 'ShippoToken shippo_live_5a8c7761f47e64baa90e9d7894785bbe90cb57b5',
        'Content-Type': 'application/json'
      }
    });

    if (!ratesResponse.ok) throw new Error(`Shippo rates error: ${ratesResponse.statusText}`);

    const data = await ratesResponse.json();
    res.json(data.results);
  } catch (error) {
    console.error('Server erro
