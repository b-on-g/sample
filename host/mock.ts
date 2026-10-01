namespace $ {
	export class $bog_gtk_host_mock extends $bog_gtk_host {

		created = 0
		destroyed = 0

		create( kind: string ) {
			++ this.created
			return {
				kind,
				props: {} as Record< string, unknown >,
				text: '',
				children: [] as object[],
				events: {} as Record< string, ( value?: unknown )=> void >,
			}
		}

		prop( widget: any, name: string, value: unknown ) {
			widget.props[ name ] = value
		}

		text( widget: any, value: string ) {
			widget.text = value
		}

		event( widget: any, name: string, handler: ( value?: unknown )=> void ) {
			widget.events[ name ] = handler
			return ()=> delete widget.events[ name ]
		}

		children( widget: any, next: readonly object[] ) {
			widget.children = [ ... next ]
		}

		destroy( widget: object ) {
			++ this.destroyed
		}

	}
}
