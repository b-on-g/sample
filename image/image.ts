namespace $ {
	export class $bog_gtk_image extends $bog_gtk_view {
		override gtk_kind() { return 'image' }
		file() { return '' }
		override gtk_props() { return { file: this.file() } }
	}
}
