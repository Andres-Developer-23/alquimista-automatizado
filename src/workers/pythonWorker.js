import { formatPythonError } from '../engine/python/pythonError.js'

const PYODIDE_MODULE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs'
const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'

let pyodidePromise = null

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = import(/* @vite-ignore */ PYODIDE_MODULE_URL)
      .then(({ loadPyodide }) => loadPyodide({ indexURL: PYODIDE_INDEX_URL }))
      .then((pyodide) => {
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

function postError(error, kind = 'auto') {
  const info = formatPythonError(error, { kind })
  self.postMessage({ type: 'error', error: info, message: info.message })
}

async function runCode(code) {
  let pyodide
  try {
    pyodide = await getPyodide()
  } catch (error) {
    throw { kind: 'initialization', cause: error }
  }

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
    if (error?.kind === 'initialization') {
      postError(error.cause, 'initialization')
      return
    }
    postError(error)
  }
}

getPyodide()
  .then(() => self.postMessage({ type: 'ready' }))
  .catch((error) => {
    postError(error, 'initialization')
  })
