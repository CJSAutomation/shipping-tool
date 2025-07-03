const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-rates', async (req, res) => {
  try {
    const { zip, weight, length, width, height, value } = req.body;

    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        'Authorization': 'ShippoToken shippo_live_5a8c7761f476dbaa90ed7984785bbe90cb57b5b',
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
          zip,
          country: zip.match(/^\d+$/) ? "US" : "GB"
        },
        parcel: {
          length,
          width,
          height,
          distance_unit: "cm",
          weight,
          mass_unit: "kg"
        },
        insurance_amount: value,
        insurance_currency: "GBP",
        async: false
      })
    });

    if (!response.ok) throw new Error(`Shippo error: ${response.statusText}`);
    const data = await response.json();
    res.json(data.rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
