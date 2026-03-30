import admin from 'firebase-admin';
import fs from 'fs';

let bucket = null;

/**
 * Initialize Firebase Admin SDK if service account key exists.
 * Firebase is optional — the app works without it (files served locally).
 */
export function initFirebase() {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!keyPath || !fs.existsSync(keyPath)) {
    console.warn('⚠️  Firebase service account not found. Using local storage only.');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    bucket = admin.storage().bucket();
    console.log('✅ Firebase initialized');
    return bucket;
  } catch (err) {
    console.warn('⚠️  Firebase init failed:', err.message);
    return null;
  }
}

/**
 * Upload a file to Firebase Storage.
 * Returns the public URL, or null if Firebase is not configured.
 */
export async function uploadToFirebase(localPath, remotePath) {
  if (!bucket) return null;

  try {
    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: { contentType: 'video/mp4' },
    });
    const file = bucket.file(remotePath);
    await file.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${remotePath}`;
  } catch (err) {
    console.warn('⚠️  Firebase upload failed:', err.message);
    return null;
  }
}

export { bucket };
