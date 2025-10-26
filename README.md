# CIPHER_CHAT

### KCCA Security

-------------------

## Contents

A. Project Overview </br>
B. Current Problems and Proposed Solutions</br>
C. Requirements </br>
D Specifications


------------

## A. Project Overview </br>

Cipher_Chat is an encrypted messaging application designed to provide users with a secure, private,
and reliable platform for communication. The application leverages modern cryptographic protocols
to ensure that all messages, files, and voice attachments remain end-to-end encrypted, with no
plaintext ever exposed to servers or third parties. </br></br>
Cipher_Chat will feature multi-device support (Web, Desktop, and Mobile) with a clean, intuitive
user experience. The app integrates multi-factor authentication (MFA) for enhanced account
security and introduces an optional blockchain-based identity verification system to help users
prove key ownership and prevent impersonation attempts.
Inspired by secure messaging leaders, Cipher_Chat combines proven protocols with a modern
interface and usability enhancements to set it apart from the competition.

-----------

## B. Current Problems and Proposed Solutions

<b>Problem 1: Lack of trust in centralized messaging platforms</br></b>
Many mainstream messaging apps (e.g., Facebook Messenger, WhatsApp) are owned by
large corporations that may collect metadata, access backups, or be compelled to hand over user
information. This undermines true privacy. Cipher_Chat aims to improve upon this design by
having decentralized servers that store only encrypted information. This way, no one has access
to your chats except you.

<b>Problem 2: Metadata Protection</br></b>
Even when content is encrypted, metadata (timestamps, who messaged who, message size)
can reveal a lot about a conversation. Cipher_Chat can reduce amount of data discoverable in
metadata through techniques such as mix networks, message padding, or routing obfuscation to
reduce metadata leakage.

<b>Problem 3: User Action Tracking</br></b>
Between metadata tracking and centralized servers, it can be easy for authority figures to
track a user’s actions. Anonymous “Ephemeral Identities” allow users to generate temporary,
unlinkable IDs for sensitive conversations. This eliminates the possibility of outside forces
listening in



-----------

## C. In-Depth Look at Problems and Solutions

<p>This section describes a high-level design for Cipher\_Chat to address three core problems: centralized distrust, metadata leakage, and user action tracking. It includes the threat model, goals, architectural principles, core components, privacy techniques, tradeoffs, and a phased deployment blueprint.<br/><br/></p>

<b>Threat model and goals</b><br/>
<ul>
  <li><b>Assumptions:</b> adversaries include local/global network observers, compromised servers/operators, and legal coercion.</li>
  <li><b>Goals:</b>
    <ul>
      <li>End-to-end confidentiality (servers never see plaintext).</li>
      <li>Forward and post-compromise secrecy (ratcheting, rotation).</li>
      <li>Minimal discoverable metadata.</li>
      <li>Unlinkable ephemeral identities for sensitive sessions.</li>
      <li>Practical multi-device sync with reasonable latency/usability tradeoffs.</li>
    </ul>
  </li>
</ul>

<b>Architectural principles</b><br/>
<ul>
  <li>Zero-knowledge servers: store only opaque encrypted blobs and minimized/obfuscated routing metadata.</li>
  <li>End-to-end cryptography: clients hold private keys; servers never hold raw keys or plaintext.</li>
  <li>Layered privacy: combine transport encryption, anonymous routing (mixnet/onion), and application-level metadata minimization.</li>
  <li>User control and auditability: optional user-run nodes/federation, open-source clients, reproducible builds.</li>
</ul>

<b>Core components and how they address each problem</b><br/>

<ol>
  <li><b>Client</b>
    <ul>
      <li><b>Capabilities:</b> E2EE primitives (X3DH/Noise bootstrap), per-message ratchet (Double Ratchet), MLS for groups, device key management and verification UI.</li>
      <li><b>Local metadata minimization:</b> timestamps/counters stored locally; send fixed-size opaque envelopes to servers.</li>
      <li><b>How it helps:</b> keeps plaintext and private keys off servers; ratchets protect past/future messages.</li>
    </ul>
  </li>

  <li><b> Server(s) and federation</b>
    <ul>
      <li><b>Model:</b> federation / user-run nodes (Matrix-style or libp2p) to avoid a single corporate owner.</li>
      <li>Data stored: encrypted blobs, encrypted indices/blind indexes, no plaintext logs, short retention, GC for ephemeral IDs.</li>
      <li>How it helps: decentralizes legal/compulsion risk and reduces single points of failure.</li>
    </ul>
  </li>

  <li><b>Network privacy layer</b>
    <ul>
      <li>Techniques: optional onion routing or mixnet integration (Tor/I2P/Loopix/Sphinx), batching, padding, cover traffic, constant-size envelopes.</li>
      <li>How it helps: hides who talks to whom, timing, and size patterns.</li>
    </ul>
  </li>

  <li><b>Identity and ephemeral identities</b>
    <ul>
      <li>Primitives: DIDs, verifiable credentials; ephemeral keypairs, blinded tokens, anonymous credentials (OPRFs), ring/group signatures.</li>
      <li>How it helps: provides unlinkable, rotating identities and single-use handles to prevent long-term tracking.</li>
    </ul>
  </li>

  <li><b> Presence and discovery</b>
    <ul>
      <li>Privacy techniques: k-anonymity/time-windowed presence, blind indexed presence, PSI / hashed-identifier contact discovery, short-lived rendezvous.</li>
      <li>How it helps: minimizes exposing social graph and presence metadata.</li>
    </ul>
  </li>

  <li><b>Multi-device sync and backups</b>
    <ul>
      <li>Approaches: MLS or device group key distribution; encrypted client-side backups; threshold cryptography or social recovery.</li>
      <li>How it helps: supports multi-device usability without giving servers plaintext or master keys.</li>
    </ul>
  </li>
</ol>

<b>Privacy-preserving primitives and protocol recommendations</b><br/>
<ul>
  <li>Messaging: X3DH + Double Ratchet for 1:1; MLS for groups.</li>
  <li>Transport: TLS 1.3 for hops; optional Tor/onion or mixnet for metadata resistance; libp2p for modular networking.</li>
  <li>Identity: W3C DID + verifiable credentials or optional blockchain anchoring for non-sensitive proofs.</li>
  <li>Auth \& MFA: WebAuthn / FIDO2; anonymous credentials and OPRF for privacy-preserving auth flows.</li>
  <li>Search/indexing: searchable symmetric encryption, ORAM, or PSI when server-side search/indexing is required.</li>
</ul>

<b>Operational and security practices</b><br/>
<ul>
  <li>Minimal logging, short retention windows, automatic wiping of ephemeral artifacts, transparency reports.</li>
  <li>Reproducible builds, open source clients, third-party audits, and formal verification of critical crypto primitives where feasible.</li>
  <li>Clear key continuity and recovery UI; accept usability tradeoffs where stronger privacy demands extra user steps.</li>
</ul>

<b>Tradeoffs and UX considerations</b><br/>
<ul>
  <li>Latency/bandwidth: mixnets, padding, batching and cover traffic increase latency and bandwidth; offer simple privacy presets (Low latency / Balanced / High privacy).</li>
  <li>Complexity: MLS, anonymous credentials, and threshold schemes increase protocol surface; rely on well-tested libraries and staged rollouts.</li>
  <li>Legal/operational: federation reduces single-point compulsion but complicates moderation; design community-moderation, rate-limiting, and privacy-preserving reputation tools.</li>
</ul>

<b>Deployment blueprint (phases)</b><br/>
<ol>
  <li><b>Phase 1:</b> E2EE core — X3DH + Double Ratchet, server as encrypted store, client-side key UX, basic device sync via device group keys.</li>
  <li><b>Phase 2:</b> Federation and user-run nodes, blind-indexed contact discovery, encrypted backups with threshold/social recovery.</li>
  <li><b>Phase 3:</b> Integrate mixnet/onion transport, ephemeral identity flows and anonymous credentials, and MLS for scalable group messaging.</li>
</ol>

------

### `git branch <YOUR NAME>`

creates a branch with your name

### `git switch <YOUR NAME>`

switches to your branch

### `git add .`

adds all changes to staging area

### `git commit -m "YOUR MESSAGE"`

commits changes to local repository

### `git push origin <YOUR NAME>`

pushes changes to remote repository

Then, go to GitHub and create a pull request. Merges require approval from at least one other team member. If there are
merge conflicts, resolve them locally before pushing again. If not, the pull request can be merged.

### `npm i`

installs all dependencies

### `npm build`

updates dependencies

### `npm start`

Runs the app in the development mode.

### `cd backend && npm i`

installs all backend dependencies

### `npm start`

Runs the backend server.


---------------------------

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
Open [http://localhost:4000](http://localhost:4000) to view if backend is properly working.


The page will reload if you make edits.\
You will also see any lint errors in the console.

