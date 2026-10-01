namespace $ {
	export class $bog_gtk_button extends $bog_gtk_view {
		override gtk_kind() { return 'button' }
		title() { return '' }
		click( next?: unknown ) { return next }
		override gtk_text() { return this.title() }
		override gtk_events() { return { click: ()=> this.click( true ) } }
	}
}
