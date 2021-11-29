import {
  CollectionReference,
  DocumentData,
  Firestore,
  Query,
  QueryConstraint,
  WhereFilterOp,
  addDoc,
  collection,
  collectionChanges,
  collectionData,
  deleteDoc,
  query,
  where
} from '@angular/fire/firestore';
import { DocumentReference, doc } from '@firebase/firestore';

import { FirebaseFilter } from '../models/Firebase';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  

  constructor(private firestore: Firestore) {}

  public getCollection(collectionName: string): Observable<any[]> {
    const data: any = collection(this.firestore, collectionName);
    return collectionData(data);
  }

  public getCollectionFiltered( 
    collectionName: string,
    queries: FirebaseFilter[]
  ): Observable<any[]>  {
    const rawData: CollectionReference = collection(this.firestore, collectionName);

    const filter: QueryConstraint[] = queries.map(q => where(q.fieldPath, q.operator, q.value));

    const filteredData: Query<DocumentData> = query(rawData, ...filter);
    return collectionChanges(filteredData)
  }

   public async addDocument(collectionName: string, document: any): Promise<DocumentReference> {
    const rawData: CollectionReference = collection(
      this.firestore,
      collectionName
    );
    return addDoc(rawData, document);

  }

  public removeDocument(collectionName: string, documentId: string): Promise<void> {
    const document: DocumentReference =  doc(this.firestore, collectionName, documentId);
    return deleteDoc(document);
  }
}
