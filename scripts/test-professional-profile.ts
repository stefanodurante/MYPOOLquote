import assert from "node:assert/strict";
import { isOrganizationProfileComplete } from "../lib/organization";

const complete = {
  name: "Piscine Demo",
  legalName: "Piscine Demo S.r.l.",
  taxId: "IT12345678901",
  address: "Via Roma 1",
  postalCode: "00100",
  city: "Roma",
  email: "info@example.test",
};

assert.equal(isOrganizationProfileComplete(complete), true);
assert.equal(isOrganizationProfileComplete({ ...complete, taxId: "" }), false);
assert.equal(isOrganizationProfileComplete({ ...complete, email: " " }), false);
console.log("Professional profile validation tests passed.");
