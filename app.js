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
    const response = await fetch('https://cjs-shipping-tool.onrender.com/get-rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        zip,
        weight,
        length,
        width,
        height,
        value
      })
    });

    if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
    const data = await response.json();

    if (!data || data.length === 0) {
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
