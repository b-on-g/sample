namespace $ {
	$mol_test({
		'$bog_gtk_view keeps widget identity on reactive rerender'() {
			const host = new $bog_gtk_host_mock
			$bog_gtk_view.host = host

			class Demo extends $bog_gtk_label {
				@ $mol_mem value( next?: string ) { return next ?? 'one' }
				override text() { return this.value() }
			}

			const view = new Demo
			const first = view.gtk_mount()
			view.value( 'two' )
			const second = view.gtk_tree()

			$mol_assert_equal( first, second )
			$mol_assert_equal( host.created, 1 )
			$mol_assert_equal( ( second as any ).text, 'two' )
		},
	})
}
