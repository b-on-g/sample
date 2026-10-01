# $bog_gtk

Experimental native GTK4 renderer for $mol/MAM.

The component model stays declarative and reactive, while the host is GTK4 rather than DOM/WebView.

## Architecture

```
view.tree
   |
$bog_gtk_view extends $mol_view
   |
$bog_gtk_host
   |-- $bog_gtk_host_mock
   '-- $bog_gtk_host_gjs
          |
         GTK4
```

The current experiment deliberately overrides the rendering path instead of calling `$mol_view.render()`, `dom_tree()` or `dom_node()`.

## Supported widgets

- window
- box
- label
- button
- entry
- scroll
- image

## Build

From a MAM checkout:

```bash
npx mam bog/gtk/demo
```

## Native runtime

GTK runtime is GJS + GTK4. No WebView, Chromium, Electron, CEF or HTML renderer is used.

CI compiles the MAM module and runs the native smoke test under Xvfb.

## Status

Experimental. The primary compatibility question is how much of the existing `$mol_view` ecosystem can be reused without invoking its DOM-specific methods.
