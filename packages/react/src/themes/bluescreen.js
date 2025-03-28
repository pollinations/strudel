import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
export const settings = {
  background: '#051DB5',
  lineBackground: '#051DB550',
  foreground: 'white', // whats that?
  caret: 'white',
  selection: 'rgba(128, 203, 196, 0.5)',
  selectionMatch: '#036dd626',
  // lineHighlight: '#8a91991a', // original
  lineHighlight: '#00000050',
  gutterBackground: 'transparent',
  // gutterForeground: '#8a919966',
  gutterForeground: '#8a919966',
};

export default createTheme({
  theme: 'dark',
  settings,
  styles: [
    { tag: t.keyword, color: 'white' },
    { tag: t.operator, color: 'white' },
    { tag: t.special(t.variableName), color: 'white' },
    { tag: t.typeName, color: 'white' },
    { tag: t.atom, color: 'white' },
    { tag: t.number, color: 'white' },
    { tag: t.definition(t.variableName), color: 'white' },
    { tag: t.string, color: 'white' },
    { tag: t.special(t.string), color: 'white' },
    { tag: t.comment, color: 'white' },
    { tag: t.variableName, color: 'white' },
    { tag: t.tagName, color: 'white' },
    { tag: t.bracket, color: 'white' },
    { tag: t.meta, color: 'white' },
    { tag: t.attributeName, color: 'white' },
    { tag: t.propertyName, color: 'white' },
    { tag: t.className, color: 'white' },
    { tag: t.invalid, color: 'white' },
  ],
});
