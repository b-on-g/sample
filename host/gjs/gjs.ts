namespace $ {
	export class $bog_gtk_host_gjs extends $bog_gtk_host {

		private kinds = new WeakMap< object, string >
		private kids = new WeakMap< object, readonly object[] >
		private sizes = new WeakMap< object, { width: number, height: number } >

		constructor(
			readonly application: any,
			readonly Gtk: any,
		) {
			super()
		}

		create( kind: string ) {
			let widget: any

			switch( kind ) {
				case 'window': widget = new this.Gtk.ApplicationWindow({ application: this.application }); break
				case 'box': widget = new this.Gtk.Box(); break
				case 'label': widget = new this.Gtk.Label(); break
				case 'button': widget = new this.Gtk.Button(); break
				case 'entry': widget = new this.Gtk.Entry(); break
				case 'scroll': widget = new this.Gtk.ScrolledWindow(); break
				case 'image': widget = new this.Gtk.Image(); break
				default: $mol_fail( new Error( `Unknown GTK widget: ${ kind }` ) )
			}

			this.kinds.set( widget, kind )
			return widget
		}

		prop( widget: any, name: string, value: unknown ) {
			const kind = this.kinds.get( widget )

			if( kind === 'window' ) {
				if( name === 'title' ) widget.set_title( String( value ?? '' ) )
				const size = this.sizes.get( widget ) ?? { width: -1, height: -1 }
				if( name === 'width' ) size.width = Number( value )
				if( name === 'height' ) size.height = Number( value )
				this.sizes.set( widget, size )
				if( name === 'width' || name === 'height' ) widget.set_default_size( size.width, size.height )
				return
			}

			if( kind === 'box' ) {
				if( name === 'orientation' ) widget.set_orientation(
					value === 'horizontal' ? this.Gtk.Orientation.HORIZONTAL : this.Gtk.Orientation.VERTICAL
				)
				if( name === 'spacing' ) widget.set_spacing( Number( value ) )
				return
			}

			if( kind === 'entry' && name === 'placeholder' ) {
				widget.set_placeholder_text( String( value ?? '' ) )
				return
			}

			if( kind === 'image' && name === 'file' && value ) {
				widget.set_from_file( String( value ) )
			}
		}

		text( widget: any, value: string ) {
			switch( this.kinds.get( widget ) ) {
				case 'label': widget.set_label( value ); break
				case 'button': widget.set_label( value ); break
				case 'entry':
					if( widget.get_text() !== value ) widget.set_text( value )
					break
			}
		}

		event( widget: any, name: string, handler: ( value?: unknown )=> void ) {
			const signal =
				name === 'click' ? 'clicked' :
				name === 'input' ? 'changed' :
				name

			const id = widget.connect( signal, ()=> {
				if( name === 'input' ) handler( widget.get_text() )
				else handler()
			} )

			return ()=> widget.disconnect( id )
		}

		children( widget: any, next: readonly object[] ) {
			const prev = this.kids.get( widget ) ?? []
			const kind = this.kinds.get( widget )

			if( kind === 'window' || kind === 'scroll' ) {
				widget.set_child( next[0] ?? null )
				this.kids.set( widget, next )
				return
			}

			if( kind !== 'box' ) return

			for( const child of prev ) {
				if( !next.includes( child ) ) widget.remove( child )
			}

			let after: any = null
			for( const child of next ) {
				if( !prev.includes( child ) ) widget.insert_child_after( child, after )
				else widget.reorder_child_after( child, after )
				after = child
			}
			this.kids.set( widget, [ ... next ] )
		}

		destroy( widget: any ) {
			if( this.kinds.get( widget ) === 'window' ) widget.destroy()
			else widget.unparent?.()
		}

	}
}
