namespace $.$$ {
	export class $bog_gtk_demo extends $.$bog_gtk_demo {

		@ $mol_mem
		count( next?: number ) {
			return next ?? 0
		}

		count_title() {
			return `Count: ${ this.count() }`
		}

		increment( next?: unknown ) {
			if( next !== undefined ) this.count( this.count() + 1 )
			return null
		}

	}
}
