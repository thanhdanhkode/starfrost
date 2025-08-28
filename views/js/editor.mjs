import { basicSetup } from 'https://cdn.jsdelivr.net/npm/codemirror@6.0.2/+esm';
import { EditorState } from 'https://cdn.jsdelivr.net/npm/@codemirror/state@6.5.2/+esm';
import {
  EditorView,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
} from 'https://cdn.jsdelivr.net/npm/@codemirror/view@6.38.1/+esm';
import {
  foldGutter,
  indentOnInput,
  indentUnit,
  bracketMatching,
  foldKeymap,
  syntaxHighlighting,
  defaultHighlightStyle,
} from 'https://cdn.jsdelivr.net/npm/@codemirror/language@6.11.3/+esm';
import {} from 'https://cdn.jsdelivr.net/npm/@codemirror/autocomplete@6.18.6/+esm';

import { oneDark } from 'https://cdn.jsdelivr.net/npm/@codemirror/theme-one-dark@6.1.3/+esm';
import { javascript } from 'https://cdn.jsdelivr.net/npm/@codemirror/lang-javascript@6.2.4/+esm';

const editor = new EditorView({
  parent: document.getElementById('editor'),
  doc: 'Hello, World!',
  extensions: [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    drawSelection(),
    dropCursor(),
    rectangularSelection(),
    EditorState.allowMultipleSelections.of(true),
    crosshairCursor(),
    highlightActiveLine(),
    keymap.of([...foldKeymap]),
    javascript(),
    foldGutter(),
    indentOnInput(),
    indentUnit.of('    '),
    bracketMatching(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    oneDark,
  ],
});
