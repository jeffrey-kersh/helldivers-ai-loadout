// With no URL set, the app returns sample data
const API = import.meta.env.VITE_API_URL

/*
  Request:  { playstyle, enemy, armor, required: string[], include: string }
  Response: { armor, primary, secondary, grenade, booster,
              strategems: string[4], explanation }
*/
export async function recommend(request) {
  if (!API) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return sample()
  }
  const res = await fetch(`${API}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`The server returned ${res.status}.`)
  return res.json()
}

function sample() {
  return {
    armor: 'Heavy armor [name]',
    primary: 'R-36 Eruptor',
    secondary: 'GP-31 Pistol',
    grenade: 'G-123 Thermite',
    booster: 'Motivational Shocks',
    strategems: ['[Strategem 1]', '[Strategem 2]', '[Strategem 3]', '[Strategem 4]'],
    explanation:
      'Sample data. The AI will explain here how each pick fits the enemy front, your playstyle and your must-haves.',
  }
}
