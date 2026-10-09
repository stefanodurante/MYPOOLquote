import assert from "node:assert/strict";
import { calculateQuote } from "../lib/quote/calculate";
import { SEED_PRICES } from "../lib/quote/seed-data";
import { DEFAULT_INPUTS } from "../lib/quote/types";

const prices = Object.fromEntries(SEED_PRICES.map((item) => [item.key, item.value]));
const result = calculateQuote(DEFAULT_INPUTS, prices, "pro", "completo");

assert.equal(result.items.length, 12, "The complete quote should have 12 items.");
assert.ok(result.totals.volume > 0, "Volume must be positive.");
assert.ok(result.totals.flowRate > 0, "Flow rate must be positive.");
assert.ok(result.totals.total > result.totals.imponibile, "VAT must increase the total.");

const unchecked = calculateQuote(
  DEFAULT_INPUTS,
  prices,
  "pro",
  "completo",
  { ...result.bom, struct: { ...result.bom.struct, checked: false } },
);
assert.ok(
  unchecked.totals.total < result.totals.total,
  "Disabling a BOM item must reduce the total.",
);

console.log("Quote calculation checks passed.");
