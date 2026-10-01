namespace $ {
	export type $bog_gtk_widget = object

	export abstract class $bog_gtk_host extends $mol_object {

		abstract create( kind: string ): $bog_gtk_widget

		abstract prop( widget: $bog_gtk_widget, name: string, value: unknown ): void

		abstract text( widget: $bog_gtk_widget, value: string ): void

		abstract event( widget: $bog_gtk_widget, name: string, handler: ( value?: unknown )=> void ): ()=> void

		abstract children( widget: $bog_gtk_widget, next: readonly $bog_gtk_widget[] ): void

		abstract destroy( widget: $bog_gtk_widget ): void

	}
}
