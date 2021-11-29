import { Auth, User, UserCredential, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "@angular/fire/auth";

import { BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth: Auth = getAuth();
  user: BehaviorSubject<User | null>;

  constructor(
    private fireAuth: Auth,
  ) {
    this.user = new BehaviorSubject<User | null>(null);
    this.fireAuth.onAuthStateChanged(user => {
      this.user?.next(user);
    });
  }



  // Sign in with email and password
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Create a new user with email and password
  createUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Sign out
  signOut(): Promise<void> {
    return this.fireAuth.signOut();
  }

}
