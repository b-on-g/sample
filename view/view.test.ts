namespace $ {
	$mol_test({

		'$bog_gtk_view keeps widget identity on reactive rerender'() {
			const host = new $bog_gtk_host_mock
			$bog_gtk_view.gtk_roots.clear()
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

		'$bog_gtk_view propagates native events into state'() {
			const host = new $bog_gtk_host_mock
			$bog_gtk_view.gtk_roots.clear()
			$bog_gtk_view.host = host

			class Demo extends $bog_gtk_entry {
				@ $mol_mem override value( next?: string ) {
					return next ?? 'one'
				}
			}

			const view = new Demo
			const widget = view.gtk_mount() as any
			widget.events.input( 'two' )

			$mol_assert_equal( view.value(), 'two' )
			$mol_assert_equal( widget.text, 'two' )
		},

		'$bog_gtk_view reuses child widgets when order changes'() {
			const host = new $bog_gtk_host_mock
			$bog_gtk_view.gtk_roots.clear()
			$bog_gtk_view.host = host

			class Demo extends $bog_gtk_box {
				@ $mol_mem reversed( next?: boolean ) {
					return next ?? false
				}
				@ $mol_mem one() { return new $bog_gtk_label }
				@ $mol_mem two() { return new $bog_gtk_label }
				override sub() {
					return this.reversed()
						? [ this.two(), this.one() ]
						: [ this.one(), this.two() ]
				}
			}

			const view = new Demo
			const widget = view.gtk_mount() as any
			const first = [ ... widget.children ]

			view.reversed( true )
			view.gtk_tree()
			const second = [ ... widget.children ]

			$mol_assert_equal( first[0], second[1] )
			$mol_assert_equal( first[1], second[0] )
			$mol_assert_equal( host.created, 3 )
		},

	})
}
