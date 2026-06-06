# Firestore rules for chat (fix: “Missing or insufficient permissions”)

The backend **custom token** only proves identity to **Firebase Auth**. Reads/writes to **Cloud Firestore** are controlled separately by **Firestore Security Rules** in the Firebase project.

If chat fails right after sign-in—often on the first `setDoc` to `user_presence/{userId}`—your console rules almost certainly **don’t allow** that path (or `conversations/**`).

## Fix

1. Open [Firebase Console](https://console.firebase.google.com) → your app project (`eventsmap-d4fe8` must match `src/services/firebase.ts` `projectId`).
2. **Firestore Database** → **Rules**.
3. Paste the contents of **`firestore.rules`** in this repo (or merge those `match` blocks with any rules you already need).
4. **Publish**.

Optional (CLI):

```bash
firebase deploy --only firestore:rules
```

(project must have `firestore.rules` wired in `firebase.json`).

## Verify

- Same Firebase **project** as the web config (`firebase.ts` `projectId`) and the service account used by Laravel (`FIREBASE_CREDENTIALS`).
- After publishing, reload the app and open chat again.

## If it still fails

- In the browser **Network** tab, confirm the failing request is Firestore (not Storage).
- Check the **Firestore → Data** tab: collections are `user_presence`, `conversations`, optionally `invitation_notifications`.

## Chat availability (`chat_active`)

Each `user_presence/{userId}` document may include `chat_active` (boolean). When `chat_active` is `false`:

- The user cannot send new messages (enforced in the app and in Firestore rules).
- Other users cannot send messages to them.

After updating `firestore.rules` in this repo, **publish** rules in Firebase Console so message creates are blocked server-side for inactive users.
