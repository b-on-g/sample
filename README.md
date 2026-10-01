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


## Quick start

Minimal window with a native GTK4 label:

```view.tree
$my_app $bog_gtk_window
	window_title \My GTK app

	sub /
		<= Hello $bog_gtk_label
			text \Hello GTK
```

A reactive counter:

```view.tree
$my_counter $bog_gtk_window
	window_title \Counter

	sub /
		<= Body $bog_gtk_box
			sub /
				<= Count $bog_gtk_label
					text <= count_title

				<= Increment $bog_gtk_button
					title \Increment
					click? <=> increment? null

	count_title \
	increment? null
```

```ts
namespace $.$$ {
	export class $my_counter extends $.$my_counter {

		@ $mol_mem
		count( next?: number ) {
			return next ?? 0
		}

		count_title() {
			return `Count: ${ this.count() }`
		}

		increment( next?: unknown ) {
			if( next !== undefined ) {
				this.count( this.count() + 1 )
			}

			return null
		}

	}
}
```

When the native `Gtk.Button` emits `clicked`, the event is mapped back into the $mol component:

```
Gtk.Button::clicked
        ↓
$bog_gtk_host_gjs
        ↓
$bog_gtk_button.click()
        ↓
$mol_mem state
        ↓
gtk_tree()
        ↓
existing Gtk.Label updated
```

The GTK widget itself is memoized by `gtk_widget()`, so a normal reactive update does not recreate the entire native widget tree.

## Native entry

The native launcher creates a regular GTK4 application and installs the GJS host:

```js
import Gtk from 'gi://Gtk?version=4.0'

const $ = ( await import( './-/web.mjs' ) ).default

const app = new Gtk.Application({
	application_id: 'org.example.my_app',
})

app.connect( 'activate', ()=> {
	const root = new $.$my_counter

	$.$bog_gtk_view.host = new $.$bog_gtk_host_gjs(
		app,
		Gtk,
	)

	root.gtk_mount().present()
} )

app.run( [] )
```

Build the MAM module:

```bash
npx mam bog/gtk/demo
```

Run the native GTK4 app:

```bash
gjs -m bog/gtk/demo/native.mjs
```

On Linux the runtime requires GTK4 and GJS. No browser, DOM renderer or WebView is used for the native UI.

## Creating a widget wrapper

A basic wrapper only needs to declare its native widget kind and expose declarative properties.

For example, `$bog_gtk_label`:

```ts
namespace $ {
	export class $bog_gtk_label extends $bog_gtk_view {

		override gtk_kind() {
			return 'label'
		}

		text() {
			return ''
		}

		override gtk_text() {
			return this.text()
		}

	}
}
```

The GJS host maps `label` to a real GTK4 widget:

```ts
case 'label':
	return new this.Gtk.Label()
```

The same pattern is currently used for:

```
$bog_gtk_window
$bog_gtk_box
$bog_gtk_label
$bog_gtk_button
$bog_gtk_entry
$bog_gtk_scroll
$bog_gtk_image
```
