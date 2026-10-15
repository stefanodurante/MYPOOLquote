import assert from "node:assert/strict";
import { numericDraft, parseNumericDraft } from "../lib/quote/numeric-input";

assert.equal(numericDraft(0), "0");
assert.equal(parseNumericDraft(""), null);
assert.equal(parseNumericDraft("   "), null);
assert.equal(parseNumericDraft("1.5"), 1.5);
assert.equal(parseNumericDraft("1,5"), 1.5);
assert.equal(parseNumericDraft("05"), 5);
assert.equal(parseNumericDraft("not-a-number"), null);

console.log("Numeric input checks passed: empty drafts stay empty and decimal values parse safely.");
