import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { Auth } from 'firebase-admin/lib/auth/auth';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;
  private db: FirebaseFirestore.Firestore;
  private auth: Auth;

  constructor() {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
    this.db = admin.firestore();
    this.auth = admin.auth();
  }

  getApp() {
    return this.app;
  }

  getFirestore() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }

  async verifyIdToken(token: string) {
    return admin.auth().verifyIdToken(token);
  }
}
