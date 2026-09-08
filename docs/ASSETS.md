# Brand and image provenance

All assets needed to build the website are committed here. No private source repository or external font request is required.

- `public/brand/tokens.css`: VORO’s shared colors, font declarations, and base tokens.
- `public/brand/mark-*.svg` and `icon.png`: the original VORO sprout, supplied for the website.
- `public/brand/fonts/`: Bricolage Grotesque and DM Sans, with original OFL notices.
- `public/images/little-world.jpg`: existing VORO gouache key art, converted to an 1100px JPEG. Its original generation prompt is in `provenance.json`.
- `public/images/social.jpg`: the existing VORO presentation cover, converted to JPEG.
- `public/images/inspection.jpg` and `collection.jpg`: captures of the real desktop app with deterministic sample models. A machine-specific display path was replaced with `Little worlds / Assets` before capture. No user projects or private paths appear.
- `public/example-review.notes.json`: an actual review sidecar saved against a sample asset. IDs and timestamps belong to the illustrative review, not a customer.

The desktop application and original production generators are maintained separately. Updating screenshots is a maintainer task: use a fresh synthetic project, remove identifying paths before capture, and preserve the actual app UI. Never replace product evidence with an invented interface. Describe new image origins and transformations in `public/images/provenance.json`.

See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) for licensing and [DESIGN.md](../DESIGN.md) for visual usage. Source availability does not imply VORO endorses a derivative product.
