// Client-side auth helpers. Server endpoints should implement the matching REST/JSON flows.

type WebAuthnBeginResp = PublicKeyCredentialCreationOptions;
type WebAuthnFinishReq = { id: string; rawId: string; response: any; type: string };

export async function beginWebAuthnRegister(username: string) {
  const res = await fetch('/api/auth/webauthn/register/begin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('register begin failed');
  const json = await res.json();
  // server should return PublicKeyCredentialCreationOptions with base64url fields
  return json as WebAuthnBeginResp;
}

export async function finishWebAuthnRegister(attestation: PublicKeyCredential) {
  const payload: WebAuthnFinishReq = {
    id: attestation.id,
    rawId: arrayBufferToBase64(attestation.rawId),
    response: (attestation as any).response,
    type: attestation.type,
  };
  const res = await fetch('/api/auth/webauthn/register/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('register complete failed');
  return res.json();
}

export async function beginWebAuthnLogin(username: string) {
  const res = await fetch('/api/auth/webauthn/login/begin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('login begin failed');
  return res.json();
}

export async function finishWebAuthnLogin(assertion: PublicKeyCredential) {
  const payload = {
    id: assertion.id,
    rawId: arrayBufferToBase64(assertion.rawId),
    response: (assertion as any).response,
    type: assertion.type,
  };
  const res = await fetch('/api/auth/webauthn/login/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('login complete failed');
  return res.json();
}

// Placeholder: server-side OPAQUE/PAKE flow should replace these
export async function beginOpaqueRegister(email: string) {
  return fetch('/api/auth/opaque/register', { method: 'POST', body: JSON.stringify({ email }) });
}
export async function beginOpaqueLogin(email: string) {
  return fetch('/api/auth/opaque/login', { method: 'POST', body: JSON.stringify({ email }) });
}

/* helpers */
function arrayBufferToBase64(buf: ArrayBuffer | null) {
  if (!buf) return '';
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}