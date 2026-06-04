import test from "node:test";
import assert from "node:assert/strict";
import { Vault } from "../src/index.js";
test("stores encrypted secret", () => {
  const v = new Vault("pw"); v.put("api", "secret");
  assert.equal(v.get("api"), "secret");
  assert.equal(String(v.items.get("api").encrypted).includes("secret"), false);
});
