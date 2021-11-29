import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { AuthGuardModule } from '@angular/fire/auth-guard';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    AuthGuardModule,
  ]
})
export class FirebaseModule { }
