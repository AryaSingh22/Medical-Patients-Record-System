"use client";
import { sha256 } from "js-sha256";
import * as secp from "@noble/secp256k1";

// Returns a bytes32-like 0x-prefixed hex string for input string.
export function hash32(input: string): `0x${string}` {
  const h = sha256.create();
  h.update(input);
  return (`0x${h.hex()}`) as `0x${string}`;
}

// Returns sha256 digest as 0x-prefixed hex for raw bytes
export function sha256Hex(bytes: Uint8Array): `0x${string}` {
  const h = sha256.create();
  h.update(bytes);
  return (`0x${h.hex()}`) as `0x${string}`;
}

// Feature flag: set to true to enable ECDH + AES-GCM implementation.
const USE_REAL_CRYPTO = false;

// Utilities
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  return Uint8Array.from(clean.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
}
function bytesToHex(bytes: Uint8Array): string {
  return "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Generate ephemeral secp256k1 keypair
export async function generateKeyPair(): Promise<{ privateKey: string; publicKey: string } | null> {
  if (!USE_REAL_CRYPTO) return null;
  const priv = secp.utils.randomPrivateKey();
  const pub = secp.getPublicKey(priv, true); // compressed
  return { privateKey: bytesToHex(priv), publicKey: bytesToHex(pub) };
}

// Derive shared key using ECDH (secp256k1)
export async function deriveSharedKey(privateKeyHex: string, peerPublicKeyHex: string): Promise<CryptoKey | null> {
  if (!USE_REAL_CRYPTO) return null;
  const priv = hexToBytes(privateKeyHex);
  const pub = hexToBytes(peerPublicKeyHex);
  const shared = secp.getSharedSecret(priv, pub, true); // compressed output
  // Use SHA-256 over shared secret to get 256-bit key material
  const keyMaterial = await crypto.subtle.digest("SHA-256", shared.buffer.slice(1));
  return crypto.subtle.importKey("raw", keyMaterial, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

// Encrypt data using AES-GCM with derived/shared key
export async function encryptData(plain: Uint8Array, key: CryptoKey | null): Promise<{ iv: string; cipher: Uint8Array } | Uint8Array> {
  if (!USE_REAL_CRYPTO || !key) return plain;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
  return { iv: bytesToHex(iv), cipher: new Uint8Array(cipherBuf) };
}

// Decrypt data using AES-GCM
export async function decryptData(input: { iv: string; cipher: Uint8Array } | Uint8Array, key: CryptoKey | null): Promise<Uint8Array> {
  if (!USE_REAL_CRYPTO || !key) return input as Uint8Array;
  const { iv, cipher } = input as { iv: string; cipher: Uint8Array };
  const ivBytes = hexToBytes(iv);
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBytes }, key, cipher);
  return new Uint8Array(plainBuf);
}

// Backward-compatible placeholders
export async function encryptBytes(plain: Uint8Array, _recipientPubKey?: string): Promise<Uint8Array> {
  if (!USE_REAL_CRYPTO) return plain;
  // For now, rely on encryptData with an external shared key derivation in call-site
  return plain;
}

export async function decryptBytes(cipher: Uint8Array, _privateKey?: string): Promise<Uint8Array> {
  if (!USE_REAL_CRYPTO) return cipher;
  // For now, rely on decryptData with an external shared key derivation in call-site
  return cipher;
}
