const express = require("express");
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
const port = process.env.PORT || 3001;

const verifyToken = 'Gel*123*';

// Route for GET requests
app.get('/:society', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests with path parameter
app.post('/:society', async (req, res) => {
  const { society } = req.params;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received for ID: ${society} at ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  // Example: Call an external API with the received data and ID
  try {
    await callExternalApi(society, req.body);
  } catch (error) {
    console.error('Error calling external API:', error.message);
  }

  res.status(200).end();
});

/**
 * Example function to call an external API
 * @param {string} society The path parameter ID
 * @param {Object} data The data to send to the API
 */
async function callExternalApi(society, data) {
  // You can use the ID to customize the URL if needed
  const externalApiUrl = `https://dev-api-chatbot.grupo-lafuente.com/api/webhooks/whatsapp/${society}`;

  console.log(`Calling external API: ${externalApiUrl}...`);

  const response = await fetch(externalApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer YOUR_TOKEN' // Add auth if needed
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`External API responded with status ${response.status}`);
  }

  const result = await response.json();
  console.log('External API Response:', result);
}

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});