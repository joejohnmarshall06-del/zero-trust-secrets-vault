import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
export class Vault {
  constructor(masterPassword) { this.key = scryptSync(masterPassword, "vault-salt", 32); this.items = new Map(); this.audit = []; }
  put(name, value, actor = "system") {
    const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    this.items.set(name, { iv, encrypted, tag: cipher.getAuthTag() }); this.audit.push({ actor, action: "put", name });
  }
  get(name, actor = "system") {
    const item = this.items.get(name); if (!item) return null;
    const decipher = createDecipheriv("aes-256-gcm", this.key, item.iv); decipher.setAuthTag(item.tag);
    this.audit.push({ actor, action: "get", name });
    return Buffer.concat([decipher.update(item.encrypted), decipher.final()]).toString("utf8");
  }
}
