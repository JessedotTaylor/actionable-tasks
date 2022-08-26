import { Observable } from "rxjs";

export function getNewObservable<T>(value: T): Observable<T> {
    return new Observable(observer => {
        observer.next(value);
        observer.complete();
    })
}