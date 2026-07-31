import { useMemo, useRef, type KeyboardEvent, type UIEvent } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";

type Props = { value: string; onChange: (value: string) => void };

export function PythonCodeEditor({ value, onChange }: Props) {
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbers = value.split("\n").map((_, index) => index + 1);
  const highlightedCode = useMemo(
    () => Prism.highlight(`${value}${value.endsWith("\n") ? "\n" : ""}`, Prism.languages.python, "python"),
    [value],
  );

  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  }

  function insertIndent(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const indent = "    ";
    onChange(`${value.slice(0, start)}${indent}${value.slice(textarea.selectionEnd)}`);
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + indent.length;
    });
  }

  return (
    <div className="py-editor-container">
      <div className="py-line-numbers" aria-hidden="true">
        {lineNumbers.map((line) => <span key={line}>{line}</span>)}
      </div>
      <div className="py-editor-wrapper lab-editor-surface">
        <pre ref={highlightRef} className="py-syntax-display lab-editor-highlight language-python" aria-hidden="true">
          <code
            className="language-python"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
        <textarea
          aria-label="Python code editor"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={insertIndent}
          onScroll={syncScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="py-syntax-textarea lab-editor-input"
        />
      </div>
    </div>
  );
}
