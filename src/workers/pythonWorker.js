importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js')

let pyodidePromise = null

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide().then((pyodide) => {
      pyodide.runPython(`
import json

actions = []

def mover(x, y):
    actions.append({"action": "MOVER", "x": int(x), "y": int(y)})
`)
      return pyodide
    })
  }

  return pyodidePromise
}

async function runCode(code) {
  const pyodide = await getPyodide()

  pyodide.runPython('actions.clear()')
  await pyodide.runPythonAsync(code)

  const serialized = pyodide.runPython('json.dumps(actions)')
  return JSON.parse(serialized)
}

self.onmessage = async (event) => {
  const { type, code } = event.data ?? {}
  if (type !== 'run') return

  try {
    const actions = await runCode(code)
    self.postMessage({ type: 'result', actions })
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

getPyodide()
  .then(() => self.postMessage({ type: 'ready' }))
  .catch((error) => {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    })
  })
