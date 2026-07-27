# WrenAI wren-core-wasm condvar panic MRE

Minimal reproduction of `condvar wait not supported` panic in `@wrenai/wren-core-wasm@0.4.1`
when querying a Parquet file in URL mode.

## The bug

`ListingTable` over HTTP creates multi-partition scan plans. `FileScanExec` spawns
tasks per partition and uses `std::sync::Condvar` for coordination. On
`wasm32-unknown-unknown` (no atomics/threading), `Condvar::wait` panics.

## Reproduction

```bash
npm install
npx serve .
# Open http://localhost:3333
```

Or just visit the GitHub Pages deployment:
https://riziles.github.io/wrenai-condvar-mre/

The Parquet file (200K rows, 4 row groups, ~2.6 MB) triggers a multi-partition scan.
The WASM binary is fetched from npm at deploy time (not committed).

## Expected fix

Configure `SessionContext` with `target_partitions = 1` for WASM builds to force
single-partition scans.

## Related

- [WrenAI #2291](https://github.com/Canner/WrenAI/pull/2291) — prior tokio::spawn fix
- [WrenAI #2553](https://github.com/Canner/WrenAI/issues/2553) — issue report
