namespace $ {
	export class $bog_gtk_label extends $bog_gtk_view {
		override gtk_kind() { return 'label' }
		text() { return '' }
		override gtk_text() { return this.text() }
	}
}
