import assert from "node:assert/strict";
import {
  APP_ROLES,
  getRolePermissions,
  hasPermission,
  isAppRole,
} from "../lib/roles";
import { assertRole } from "../lib/session-authorization";

assert.deepEqual(APP_ROLES, ["staff", "professional", "customer"]);
assert.ok(isAppRole("staff"));
assert.ok(isAppRole("professional"));
assert.ok(isAppRole("customer"));
assert.equal(isAppRole("unknown"), false);

assert.equal(hasPermission("staff", "platform:manage"), true);
assert.equal(hasPermission("professional", "quotes:create"), true);
assert.equal(hasPermission("professional", "platform:manage"), false);
assert.equal(hasPermission("customer", "quotes:read"), true);
assert.equal(hasPermission("customer", "quotes:update"), false);
assert.deepEqual(getRolePermissions("unknown"), []);

assert.doesNotThrow(() => assertRole("professional", ["professional"]));
assert.throws(() => assertRole("customer", ["professional"]), /Forbidden/);

console.log("Role and permission checks passed.");
