// Lightweight IndexedDB wrapper + WebCrypto passphrase encryption helpers.

import { openDB } from 'idb';

const DB_NAME = 'cipher-chat';
const DB_STORE = 'blobs';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    },
  });
}

async function deriveKeyFromPassword(password: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 200_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptBlob(password: string, data: Uint8Array) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyFromPassword(password, salt);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(ct)),
  };
}

export async function decryptBlob(password: string, encrypted: { salt: number[]; iv: number[]; ciphertext: number[] }) {
  const salt = new Uint8Array(encrypted.salt);
  const iv = new Uint8Array(encrypted.iv);
  const ct = new Uint8Array(encrypted.ciphertext);
  const key = await deriveKeyFromPassword(password, salt);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return new Uint8Array(plain);
}

export async function putBlob(key: string, value: any) {
  const db = await initDB();
  return db.put(DB_STORE, value, key);
}

export async function getBlob<T = any>(key: string): Promise<T | undefined> {
  const db = await initDB();
  return db.get(DB_STORE, key);
}

export async function deleteBlob(key: string) {
  const db = await initDB();
  return db.delete(DB_STORE, key);
}