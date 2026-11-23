import { useState } from 'react'
import { playstyles, enemies, armors, gear } from './data'
import { recommend } from './api'

const STEPS = ['Mission', 'Must-haves', 'Loadout']
const START = { playstyle: null, enemy: null, armor: null, required: [], include: '' }

function Choices({ legend, options, value, onChange }) {
  return (
    <fieldset className="group">
      <legend>{legend}</legend>
      <div className="tiles">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className="tile"
            aria-pressed={value === o.id}
            onClick={() => onChange(value === o.id ? null : o.id)}
          >
            <span className="tile-name">{o.name}</span>
            <span className="tile-desc">{o.desc}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Slot({ label, value }) {
  return (
    <div className="slot">
      <span className="slot-label">{label}</span>
      <span className="slot-value">{value}</span>
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(1)
  const [pick, setPick] = useState(START)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (value) => setPick((p) => ({ ...p, [key]: value }))
  const toggleGear = (g) =>
    setPick((p) => ({
      ...p,
      required: p.required.includes(g) ? p.required.filter((x) => x !== g) : [...p.required, g],
    }))

  async function build() {
    setStep(3)
    setLoading(true)
    setError('')
    try {
      setResult(await recommend(pick))
    } catch (e) {
      setResult(null)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setPick(START)
    setResult(null)
    setError('')
    setStep(1)
  }

  const label = (list, id) => list.find((o) => o.id === id)?.name

  return (
    <div className="app">
      <header className="bar">
        <span className="brand">Loadout Builder</span>
        <ol className="steps" aria-label="Progress">
          {STEPS.map((name, i) => (
            <li key={name} aria-current={step === i + 1 ? 'step' : undefined}>
              <span className="dot">{i + 1}</span>
              {name}
            </li>
          ))}
        </ol>
      </header>

      <main className="page">
        {step === 1 && (
          <>
            <h1>Choose your mission</h1>
            <p className="lede">Tell us how you want to play and who you are fighting.</p>
            <Choices legend="Playstyle" options={playstyles} value={pick.playstyle} onChange={set('playstyle')} />
            <Choices legend="Enemy front" options={enemies} value={pick.enemy} onChange={set('enemy')} />
            <div className="actions end">
              <button
                className="btn primary"
                disabled={!pick.playstyle || !pick.enemy}
                onClick={() => setStep(2)}
              >
                Next: must-haves
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Lock in your must-haves</h1>
            <p className="lede">Pick what your loadout has to include. Leave the rest to the AI.</p>
            <Choices legend="Armor class" options={armors} value={pick.armor} onChange={set('armor')} />
            <fieldset className="group">
              <legend>Required gear</legend>
              <div className="chips">
                {gear.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className="chip"
                    aria-pressed={pick.required.includes(g)}
                    onClick={() => toggleGear(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="group">
              <label htmlFor="include">Include a specific item (optional)</label>
              <input
                id="include"
                type="text"
                placeholder="e.g. Recoilless Rifle"
                value={pick.include}
                onChange={(e) => set('include')(e.target.value)}
              />
            </div>
            <div className="actions">
              <button className="btn" onClick={() => setStep(1)}>Back</button>
              <button className="btn primary" onClick={build}>Build my loadout</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1>Your loadout</h1>
            <ul className="tags">
              {[label(enemies, pick.enemy), label(playstyles, pick.playstyle), label(armors, pick.armor), ...pick.required]
                .filter(Boolean)
                .map((t) => <li key={t}>{t}</li>)}
            </ul>

            {loading && <p className="status" role="status">Building your loadout…</p>}
            {error && (
              <p className="status error" role="alert">
                Could not build a loadout. {error} Try again, or change your picks.
              </p>
            )}

            {result && !loading && (
              <div className="result">
                <div className="slots">
                  <Slot label="Armor" value={result.armor} />
                  <Slot label="Primary" value={result.primary} />
                  <Slot label="Secondary" value={result.secondary} />
                  <Slot label="Grenade" value={result.grenade} />
                  <Slot label="Booster" value={result.booster} />
                  {result.strategems.map((s, i) => <Slot key={i} label={`Strategem ${i + 1}`} value={s} />)}
                </div>
                <aside className="why">
                  <h2>Why this build</h2>
                  <p>{result.explanation}</p>
                </aside>
              </div>
            )}

            <div className="actions">
              <button className="btn primary" onClick={build} disabled={loading}>Regenerate</button>
              <button className="btn" onClick={() => setStep(2)}>Change picks</button>
              <button className="btn" onClick={reset}>Start over</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
