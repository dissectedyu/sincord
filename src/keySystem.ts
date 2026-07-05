/**
 * Simple Offline Key + HWID System for Sincord
 */

import { nanoid } from "nanoid";
import { createHash } from "crypto";

// Generate unique machine HWID
export function getHWID(): string {
    const os = require("os");
    const platform = process.platform;
    const arch = process.arch;
    const hostname = os.hostname();
    const username = os.userInfo().username;
    
    const data = `${platform}-${arch}-${hostname}-${username}`;
    return createHash("sha256").update(data).digest("hex").slice(0, 32);
}

// Validate key
export function validateKey(key: string, hwid: string): boolean {
    if (!key || typeof key !== "string") return false;
    if (!key.startsWith("SINCORD-")) return false;

    try {
        const parts = key.split("-");
        if (parts.length !== 5) return false;

        const checksum = createHash("sha256")
            .update(parts.slice(1, 4).join("-") + hwid)
            .digest("hex")
            .slice(0, 8)
            .toUpperCase();

        return parts[4] === checksum;
    } catch {
        return false;
    }
}

// Main check
export async function checkKeySystem(): Promise<boolean> {
    const Settings = (await import("@api/Settings")).Settings;
    
    const savedKey = (Settings.plugins?.KeySystem?.key as string) || "";

    if (!savedKey) {
        console.error("[KeySystem] No activation key found.");
        return false;
    }

    const hwid = getHWID();
    const isValid = validateKey(savedKey, hwid);

    if (isValid) {
        console.log("[KeySystem] ✅ Valid key activated");
        return true;
    } else {
        console.error("[KeySystem] ❌ Invalid key or HWID mismatch");
        return false;
    }
}

// Generate a key (for you to give to users)
export function generateKey(): string {
    const random = nanoid(16).toUpperCase();
    const hwid = getHWID();
    const checksum = createHash("sha256")
        .update(random + hwid)
        .digest("hex")
        .slice(0, 8)
        .toUpperCase();
    return `SINCORD-${random.slice(0,4)}-${random.slice(4,8)}-${random.slice(8,12)}-${checksum}`;
}
