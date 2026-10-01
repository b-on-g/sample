# Architecture

## Result of $mol_view investigation

The reactive/model part is reusable, but DOM is not isolated behind a single renderer interface.

Direct DOM dependencies in current `$mol_view` include:

- static root discovery
- focus handling
- geometry measurement
- `dom_node_external()`
- `dom_node()`
- `dom_tree()`
- `dom_node_actual()`
- `render()`
- DOM events
- DOM cleanup in `destructor()`

Therefore overriding only `render()` is insufficient.

The prototype still subclasses `$mol_view`, but introduces a parallel native host contract:

```
$mol_object
   ^
$mol_view
   ^
$bog_gtk_view
   |
$bog_gtk_host
   +-- mock
   '-- GJS/GTK4
```

GTK rendering never calls the DOM rendering methods. Widget identity is memoized separately by `gtk_widget()`.

## Compatibility boundary

Reusable without DOM:

- ownership
- view.tree-generated component classes
- $mol_mem state/computed values
- sub()/sub_visible()
- component identity
- lifecycle concepts

DOM-specific components require GTK counterparts when they directly call DOM APIs.
