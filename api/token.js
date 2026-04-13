export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey  = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return res.status(200).json({ configured: false });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[token] ElevenLabs error:', err);
      return res.status(200).json({ configured: true, tokenGenerated: false, error: err });
    }

    const data = await response.json();
    return res.status(200).json({
      configured: true,
      tokenGenerated: true,
      token: data.token,
      agentId,
    });
  } catch (e) {
    console.error('[token] fetch error:', e);
    return res.status(500).json({ configured: false, error: e.message });
  }
}
