namespace $ {
	export class $bog_gtk_box extends $bog_gtk_view {
		override gtk_kind() { return 'box' }
		orientation() { return 'vertical' as 'vertical' | 'horizontal' }
		spacing() { return 8 }
		override gtk_props() {
			return { orientation: this.orientation(), spacing: this.spacing() }
		}
	}
}
