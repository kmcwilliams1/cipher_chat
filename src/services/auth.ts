
type WebAuthnBeginResp = PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions;
type WebAuthnFinishReq = { id: string; rawId: string; response: any; type: string };

function b64urlToBase64(input: string) {
  // convert base64url to standard base64 and add padding
  let s = input.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
}

function base64ToArrayBufferSafe(base64OrBase64url: string) {
  const b64 = b64urlToBase64(base64OrBase64url);
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function beginWebAuthnRegister(username: string) {
  const res = await fetch('/api/auth/webauthn/register/begin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('register begin failed');
  const json = await res.json();

  // convert server-sent base64url strings into ArrayBuffers for the browser API
  const options: any = { ...json };
  if (json.challenge) options.challenge = base64ToArrayBufferSafe(json.challenge);
  if (json.user && json.user.id) options.user = { ...json.user, id: base64ToArrayBufferSafe(json.user.id) };
  // allowCredentials (rare on create) if present
  if (Array.isArray(json.allowCredentials)) {
    options.allowCredentials = json.allowCredentials.map((c: any) => ({
      ...c,
      id: typeof c.id === 'string' ? base64ToArrayBufferSafe(c.id) : c.id,
    }));
  }
  return options as WebAuthnBeginResp;
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
  const json = await res.json();

  // convert challenge and allowCredentials ids to ArrayBuffers
  const options: any = { ...json };
  if (json.challenge) options.challenge = base64ToArrayBufferSafe(json.challenge);
  if (Array.isArray(json.allowCredentials)) {
    options.allowCredentials = json.allowCredentials.map((c: any) => ({
      ...c,
      id: typeof c.id === 'string' ? base64ToArrayBufferSafe(c.id) : c.id,
    }));
  }
  return options as WebAuthnBeginResp;
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
  // keep exported name for other callers, accept standard base64 (not url-safe)
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}