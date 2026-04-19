# wincon-antora-ui

Shared [Antora](https://antora.org) UI bundle used by the four books
hosted under <https://wintermeyer-consulting.de>:

- [rails-book](https://github.com/wintermeyer/rails-book) — `/rails/book/`
- [phoenix-book](https://github.com/wintermeyer/phoenix-book) — `/phoenix/book/`
- [ruby-book](https://github.com/wintermeyer/ruby-book) — `/ruby/book/`
- [elixir-book](https://github.com/wintermeyer/elixir-book) — `/elixir/book/`

The site chrome (top nav, footer) is pulled by each book's
`scripts/fetch-partials.sh` from the canonical source in
[`wincon/priv/static/partials/`](https://github.com/wintermeyer/wincon/tree/main/priv/static/partials)
at build time; that step also stamps `data-book-current="rails"`,
`="phoenix"`, `="ruby"` or `="elixir"` so the active stack link gets
highlighted by the CSS rule in this bundle.

The bundle is styled with Tailwind CSS v4. Dark mode follows the OS
`prefers-color-scheme`. System fonts only (Georgia / system sans /
ui-monospace).

## How each book consumes it

The books' `antora-playbook.yml` points `ui.bundle.url` at the
`latest` release of this repo:

```yaml
ui:
  bundle:
    url: https://github.com/wintermeyer/wincon-antora-ui/releases/download/latest/ui-bundle.zip
    snapshot: true
```

A push to `main` here re-builds `ui-bundle.zip` and re-uploads it to
the `latest` GitHub release (see `.github/workflows/publish.yml`).
Both books pull the fresh bundle on their next deploy.

## Layout

```
src/
  css/site.css               # Tailwind v4 entry
  js/site.js                 # minified Antora default TOC behaviour
  layouts/default.hbs        # page shell
  layouts/404.hbs
  partials/*.hbs             # handlebars partials Antora renders into pages
  helpers/                   # Antora default helpers (url-resolution etc.)
  img/                       # chevron icons used by the mobile nav toggle
scripts/
  clean.mjs                  # remove build/
  copy.mjs                   # copy src/ into build/bundle/
  stamp-version.mjs          # rewrite CSS/JS hrefs with ?v=<sha1[:8]>
  zip.mjs                    # zip build/bundle/ into build/ui-bundle.zip
```

The stamp step hashes the built `site.css` / `site.js` and appends
the hash as a query-string to the `<link>` / `<script>` in the
compiled partials. Returning visitors hit nginx's 30-day cache on
every asset until the asset changes, at which point the URL
changes and the cache miss pulls the new version immediately.

## Build locally

```sh
npm install
npm run build      # writes build/ui-bundle.zip
```

For faster iteration when editing CSS:

```sh
npm run dev        # tailwindcss --watch
```

Either book can preview against a local WIP copy by pointing its
`antora-local-playbook.yml` at `/path/to/wincon-antora-ui/build/ui-bundle.zip`
— nothing needs to be published for that.

## Contributing

- Edit under `src/`. The top-nav and footer HBS partials
  (`header-content.hbs`, `footer-content.hbs`) are the
  build-time-overridden shells — the real content comes from
  `wincon/priv/static/partials/` in the wincon repo.
- Avoid breaking changes: the two books' CI deploys pick up changes
  as soon as they land on `main` here.

## License

Apache 2.0 for the Antora default UI pieces carried here;
wincon-specific styles under the same license.
