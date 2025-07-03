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
        Authorization: 'ShippoToken shippo_live_5a8c7761f47e64baa90e9d7894785bbe90cb57b5',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address_from: {
          name: 'CJS Automation',
          street1: 'Newlands Grange',
          city: 'Rugeley',
          zip: 'WS15 3JD',
          country: 'GB'
        },
        address_to: {
          zip,
          country: zip.match(/^\d{5}$/) ? 'US' : 'GB'
        },
        parcels: [
          {
            length,
            width,
            height,
            distance_unit: 'cm',
            weight,
            mass_unit: 'kg'
          }
        ],
        insurance_amount: value,
        insurance_currency: 'GBP',
        async: false
      })
    });

    if (!response.ok) throw new Error(`Shippo error: ${response.statusText}`);

    const shipmentData = await response.json();

    if (!shipmentData.rates || shipmentData.rates.length === 0) {
      return res.status(200).json([]); // send empty array to avoid frontend crash
    }

    // Simplify the rate data before sending to frontend
    const rates = shipmentData.rates.map(rate => ({
      provider: rate.provider,
      servicelevel_name: rate.servicelevel.name,
      amount: rate.amount
    }));

    res.status(200).json(rates);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
