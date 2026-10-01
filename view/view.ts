namespace $ {
	export class $bog_gtk_view extends $mol_view {

		static host = null as $bog_gtk_host | null
		static gtk_roots = new Set< $bog_gtk_view >

		gtk_kind() {
			return 'box'
		}

		gtk_props() {
			return {} as Record< string, unknown >
		}

		gtk_text() {
			return ''
		}

		gtk_events() {
			return {} as Record< string, ( value?: unknown )=> void >
		}

		gtk_host() {
			const host = ( this.constructor as typeof $bog_gtk_view ).host ?? $bog_gtk_view.host
			if( !host ) $mol_fail( new Error( '$bog_gtk_view.host is not configured' ) )
			return host
		}

		@ $mol_mem
		gtk_widget() {
			return this.gtk_host().create( this.gtk_kind() )
		}

		@ $mol_mem
		gtk_event_off() {
			const host = this.gtk_host()
			const widget = this.gtk_widget()
			return Object.entries( this.gtk_events() ).map( ([ name, handler ])=> host.event( widget, name, value => {
				handler( value )
				for( const root of $bog_gtk_view.gtk_roots ) root.gtk_tree()
			} ) )
		}

		gtk_tree() {
			const host = this.gtk_host()
			const widget = this.gtk_widget()

			for( const [ name, value ] of Object.entries( this.gtk_props() ) ) {
				host.prop( widget, name, value )
			}

			host.text( widget, this.gtk_text() )
			this.gtk_event_off()

			const kids = [] as $bog_gtk_widget[]
			for( const child of this.sub_visible() ?? [] ) {
				if( child instanceof $bog_gtk_view ) {
					kids.push( child.gtk_tree() )
					continue
				}
				if( child == null || child === false ) continue
				const label = host.create( 'label' )
				host.text( label, String( child ) )
				kids.push( label )
			}

			host.children( widget, kids )
			return widget
		}

		gtk_mount() {
			$bog_gtk_view.gtk_roots.add( this )
			return this.gtk_tree()
		}

		override destructor() {
			$bog_gtk_view.gtk_roots.delete( this )
			for( const off of $mol_wire_probe( ()=> this.gtk_event_off() ) ?? [] ) off()
			const widget = $mol_wire_probe( ()=> this.gtk_widget() )
			if( widget ) this.gtk_host().destroy( widget )
		}

	}
}
