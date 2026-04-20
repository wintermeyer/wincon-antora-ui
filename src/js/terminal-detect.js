// Tag <pre> blocks that contain shell / REPL transcripts so
// the CSS can render them as terminal windows.
//
// We can't detect these purely from Antora's output because
// the [source,elixir] markup used for iex sessions is the same
// as the markup used for plain Elixir code files. The only
// reliable signal is the content's first prompt: `iex>`, `irb>`,
// `>>`, or `$ ` (plus the `language-bash` class from site.js's
// own `$ `-prefixed literal-block conversion, which we honour
// as the canonical shell marker).
//
// Runs after site.js in the footer, by which point the toolbox
// and any literal-block → console conversions have already
// happened. We just add the `is-terminal` class; the CSS does
// the rest.
(function () {
  'use strict'

  var TERMINAL_PREFIX = /^\s*(iex(\([^)]*\))?>|irb(\([^)]*\))?>|>>|\$\s|[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+[:#$]\s)/

  var blocks = document.querySelectorAll('.doc pre.highlight, .doc .literalblock pre')
  for (var i = 0; i < blocks.length; i++) {
    var pre = blocks[i]
    var code = pre.querySelector('code')
    var isBash = code && (code.classList.contains('language-bash') || code.classList.contains('language-console') || code.classList.contains('language-shell'))
    var text = (pre.innerText || '').replace(/^\s+/, '')
    if (isBash || TERMINAL_PREFIX.test(text)) {
      pre.classList.add('is-terminal')
    }
  }
})()
