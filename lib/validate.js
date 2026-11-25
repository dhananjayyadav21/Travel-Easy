import { NextResponse } from "next/server";

/** Returns a 400 NextResponse if any required field is missing/falsy */
export function requireFields(body, fields) {
    for (const field of fields) {
        if (body[field] === undefined || body[field] === null || body[field] === "") {
            return NextResponse.json(
                { error: `${field} is required.` },
                { status: 400 }
            );
        }
    }
    return null;
}

/** Validates a phone number string — 10–15 digits after stripping non-digits */
export function isValidPhone(val) {
    return /^\d{10,15}$/.test(String(val).replace(/\D/g, ""));
}

/** Validates an email address */
export function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val));
}

/** Validates a PAN card number */
export function isValidPan(val) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(val).toUpperCase());
}

/** Validates a vehicle number (alphanumeric) */
export function isValidVehicle(val) {
    return /^[A-Z0-9]+$/.test(String(val).replace(/\s+/g, "").toUpperCase());
}

/** Returns { valid: true } or { valid: false, response: NextResponse } */
export function validateOrFail(condition, message, status = 400) {
    if (!condition) {
        return { valid: false, response: NextResponse.json({ error: message }, { status }) };
    }
    return { valid: true };
}
