document.getElementById('shipping-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const zip = document.getElementById('zip').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const length = parseFloat(document.getElementById('length').value);
  const width = parseFloat(document.getElementById('width').value);
  const height = parseFloat(document.getElementById('height').value);
  const value = parseFloat(document.getElementById('value').value);

  const resultBox = document.getElementById('result');
  resultBox.innerHTML = '<p>Fetching rates...</p>';

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
          country: zip.match(/^\d+$/) ? "US" : "GB" // Quick logic for demo (adjust based on actual country detection)
        },
        parcel: {
          length: length,
          width: width,
          height: height,
          distance_unit: "cm",
          weight: weight,
          mass_unit: "kg"
        },
        insurance_amount: value,
        insurance_currency: "GBP",
        async: false
      })
    });

    if (!response.ok) throw new Error(`Shippo error: ${response.statusText}`);

    const data = await response.json();

    if (data.length === 0) {
      resultBox.innerHTML = '<p>No rates found.</p>';
      return;
    }

    const fastest = data[0];
    const cheapest = data.reduce((min, rate) => rate.amount < min.amount ? rate : min, data[0]);

    resultBox.innerHTML = `
      <h3>Results</h3>
      <p><strong>Fastest:</strong> ${fastest.provider} - £${fastest.amount}</p>
      <p><strong>Cheapest:</strong> ${cheapest.provider} - £${cheapest.amount}</p>
    `;
  } catch (err) {
    console.error(err);
    resultBox.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});
