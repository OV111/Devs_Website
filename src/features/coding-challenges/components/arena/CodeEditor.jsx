import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  indentOnInput,
  indentUnit,
} from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { arenaTheme, arenaHighlight } from "../../lib/editorTheme";

/**
 * CodeMirror 6 editor for the arena.
 *
 * Two things make this less trivial than it looks:
 *
 * 1. CodeMirror owns its own DOM and document. React must not re-render it on
 *    every keystroke, so the view is created once per file and kept in a ref.
 *    `value` is only pushed in when it differs from what the editor already
 *    holds — otherwise typing would fight the controlled prop and the cursor
 *    would jump to the end on every character.
 *
 * 2. `onChange` is read through a ref inside the update listener. The listener
 *    is baked into the EditorState at construction, so a stale closure would
 *    otherwise keep calling the first render's handler forever.
 */
export default function CodeEditor({ value, onChange, readOnly = false }) {
  const host = useRef(null);
  const view = useRef(null);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;

    const state = EditorState.create({
      doc: value ?? "",
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        drawSelection(),
        history(),
        bracketMatching(),
        indentOnInput(),
        indentUnit.of("  "),
        javascript(),
        arenaHighlight,
        arenaTheme,
        // indentWithTab last so Tab indents instead of leaving the editor.
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        }),
      ],
    });

    view.current = new EditorView({ state, parent: host.current });
    if (readOnly) view.current.dom.classList.add("arena-readonly");

    return () => {
      view.current?.destroy();
      view.current = null;
    };
    // Rebuilt only when the read-only mode flips — switching files remounts
    // this component via its key, so `value` is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  // Adopt an external change (a reset, or a draft arriving from the server)
  // without clobbering what the user is typing.
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const current = v.state.doc.toString();
    if (value != null && value !== current) {
      v.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={host} className="h-full overflow-hidden" />;
}
