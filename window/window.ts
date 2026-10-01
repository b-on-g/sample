namespace $ {
	export class $bog_gtk_window extends $bog_gtk_view {
		override gtk_kind() { return 'window' }
		window_title() { return this.title() }
		width() { return 480 }
		height() { return 320 }
		override gtk_props() {
			return { title: this.window_title(), width: this.width(), height: this.height() }
		}
	}
}
