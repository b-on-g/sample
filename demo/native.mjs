import Gtk from 'gi://Gtk?version=4.0'
import GLib from 'gi://GLib?version=2.0'

globalThis.self = globalThis
self.addEventListener ??= ()=> {}
self.removeEventListener ??= ()=> {}

const $ = ( await import( './-/web.mjs' ) ).default

const app = new Gtk.Application({
	application_id: 'org.b_on_g.gtk.demo',
})

app.connect( 'activate', ()=> {
	const demo = new $.$bog_gtk_demo
	$.$bog_gtk_view.host = demo.native_host( app, Gtk )

	const window = demo.gtk_mount()
	window.present()

	if( ARGV.includes( '--smoke' ) ) {
		GLib.timeout_add( GLib.PRIORITY_DEFAULT, 250, ()=> {
			if( !( window instanceof Gtk.ApplicationWindow ) ) throw new Error( 'Native root is not Gtk.ApplicationWindow' )
			if( !demo.Increment().gtk_widget() ) throw new Error( 'Button was not created' )
			demo.increment( true )
			demo.gtk_tree()
			if( demo.count() !== 1 ) throw new Error( 'Reactive counter did not update' )
			app.quit()
			return GLib.SOURCE_REMOVE
		} )
	}
} )

app.run( [] )
