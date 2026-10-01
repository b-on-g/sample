namespace $.$$ {
	export class $bog_gtk_demo extends $.$bog_gtk_demo {

		@ $mol_mem
		count( next?: number ) {
			return next ?? 0
		}

		count_title() {
			return `Count: ${ this.count() }`
		}

		greeting() {
			return `Hello, ${ this.name() || 'World' }`
		}

		increment( next?: unknown ) {
			if( next !== undefined ) this.count( this.count() + 1 )
			return null
		}

		native_host( application: any, Gtk: any ) {
			return new $bog_gtk_host_gjs( application, Gtk )
		}

	}
}
