# WrenAI wren-core-wasm condvar panic MRE

Minimal reproduction of `condvar wait not supported` panic in `@wrenai/wren-core-wasm@0.4.1`
when querying a Parquet file in URL mode.

## The bug

`ListingTable` over HTTP creates multi-partition scan plans. `FileScanExec` spawns
tasks per partition and uses `std::sync::Condvar` for coordination. On
`wasm32-unknown-unknown` (no atomics/threading), `Condvar::wait` panics.

## Reproduction

```bash
node serve.mjs         # Start local file server on :3333
# Open index.html in a browser (or use a dev server)
```

The Parquet file (39 MB, ~4M rows, multiple row groups) is served locally at
`http://localhost:3333/data.parquet`. When `WrenEngine` queries it, the multi-row-group
structure triggers a multi-partition scan and the Condvar panic.

## Expected fix

Configure `SessionContext` with `target_partitions = 1` for WASM builds to force
single-partition scans.

## Related

- [WrenAI #2291](https://github.com/Canner/WrenAI/pull/2291) — prior tokio::spawn fix
- [WrenAI #2553](https://github.com/Canner/WrenAI/issues/2553) — issue report
