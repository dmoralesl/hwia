import { Firestore, collection, collectionData } from '@angular/fire/firestore';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { People } from './../models/People';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(
    private http: HttpClient, 
    private firestore: Firestore
    ) { }

    public getCollection(collectionName: string): Observable<People[]> {
      const data: any = collection(this.firestore, collectionName);
      return collectionData(data);
       
    }

}
