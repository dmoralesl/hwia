import { WhereFilterOp } from "@angular/fire/firestore";

export interface FirebaseFilter {
    fieldPath: string;
    operator: WhereFilterOp;
    value: string | any[];
}