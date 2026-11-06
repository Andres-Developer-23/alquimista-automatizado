import Editor from '@monaco-editor/react'

export function CodeEditor({ value, onChange }) {
  return (
    <Editor
      height="100%"
      language="python"
      theme="vs-dark"
      value={value}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      options={{
        automaticLayout: true,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 14,
        minimap: { enabled: false },
        padding: { top: 20 },
        scrollBeyondLastLine: false,
        tabSize: 4,
      }}
    />
  )
}
