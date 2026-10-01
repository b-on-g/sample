namespace $ {
	export class $bog_gtk_entry extends $bog_gtk_view {
		override gtk_kind() { return 'entry' }
		value( next?: string ) { return next ?? '' }
		placeholder() { return '' }
		override gtk_text() { return this.value() }
		override gtk_props() { return { placeholder: this.placeholder() } }
		override gtk_events() {
			return { input: value => this.value( String( value ?? '' ) ) }
		}
	}
}
