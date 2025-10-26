// Usage: run from your running app code or in browser console (adapt imports/paths).
import { getBlob, decryptBlob, encryptBlob, putBlob } from '../lib/storage';


async function verifyLocalBundle(email: string, passphrase: string) {
  try {
    const key = 'keybundle:' + email;
    const blob = await getBlob<any>(key);
    if (!blob) {
      console.warn('Local: no bundle found for', email);
      return { ok: false, reason: 'no-local-bundle' };
    }
    try {
      const plain = await decryptBlob(passphrase, blob);
      console.log('Local: decrypted bundle length', plain.byteLength || plain.length);
      return { ok: true, detail: 'local-decrypt-success' };
    } catch (err) {
      console.warn('Local: bundle exists but decryption failed (wrong passphrase?)', err);
      return { ok: false, reason: 'local-decrypt-failed' };
    }
  } catch (err) {
    console.error('Local check error', err);
    return { ok: false, reason: 'local-error' };
  }
}

async function checkServerRegistration(email: string) {
    try {
        const userRes = await fetch(`/api/auth/user?email=${encodeURIComponent(email)}`, { method: 'GET' });
        const userText = await userRes.text();
        let userJson: any = null;
        try {
            userJson = JSON.parse(userText);
        } catch (parseErr) {
            console.warn('Server: /api/auth/user returned non-JSON:', userRes.status, userRes.statusText);
            console.log('Server response body (text):', userText);
            return { ok: false, reason: 'server-non-json', status: userRes.status, body: userText };
        }
        console.log('Server: user record', userJson);

        const prekeyRes = await fetch(`/api/prekeys/${encodeURIComponent(email)}`, { method: 'GET' });
        const prekeyText = await prekeyRes.text();
        let prekeys: any = null;
        try {
            prekeys = prekeyRes.ok ? JSON.parse(prekeyText) : null;
        } catch {
            console.warn('Server: /api/prekeys returned non-JSON:', prekeyRes.status);
            console.log('Prekeys response body (text):', prekeyText);
            prekeys = null;
        }
        console.log('Server: prekeys', prekeys);

        const ok = userJson?.exists === true && !!userJson?.credentialId;
        return { ok, user: userJson, prekeys };
    } catch (err) {
        console.error('Server check error', err);
        return { ok: false, reason: 'server-error', error: String(err) };
    }
}

// Example combined usage:
async function runVerification(email: string, passphrase: string) {
  const local = await verifyLocalBundle(email, passphrase);
  const server = await checkServerRegistration(email);
  console.log('Verification summary:', { local, server });
  return { local, server };
}


(async function createTestBundle() {
    const email = 'you@example.com';
    const passphrase = 'your-backup-passphrase';
    // Replace with your real key material when ready
    const testBundle = new Uint8Array([1, 2, 3, 4, 5]);

    // encryptBlob, putBlob, getBlob, decryptBlob are from `src/lib/storage.ts`
    const encrypted = await encryptBlob(passphrase, testBundle);
    await putBlob('keybundle:' + email, encrypted);
    console.log('Stored encrypted bundle for', email, encrypted);

    // verify read & decrypt
    const fetched = await getBlob(`keybundle:${email}`);
    const plain = await decryptBlob(passphrase, fetched);
    console.log('Decrypted bundle:', plain);
})();

// Call from localhost console: runVerification('you@example.com', 'your-backup-passphrase');

export { verifyLocalBundle, checkServerRegistration, runVerification };

;(window as any).runVerification = runVerification;