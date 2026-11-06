export function createPythonWorker() {
  return new Worker(new URL('../../workers/pythonWorker.js', import.meta.url), {
    type: 'module',
  })
}
