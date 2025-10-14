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



### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

