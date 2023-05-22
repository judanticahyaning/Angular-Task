import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from 'src/model/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  endpointUrl: string = 'https://angular-training-a3afa-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postUrl: string = this.endpointUrl + 'post.json';
  errorHandling = new Subject<any>();

  constructor(
    private http: HttpClient
  ) { }

  createAndPost(postData: Post) {
    this.http.post<{ name: string }>(this.postUrl, postData, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(
      (data) => {
        console.log(data);
        this.errorHandling.next(null);
      },
      (error) => {
        this.errorHandling.next(error);
      }
    );
  }

  fetchData() {
    let customParam = new HttpParams();
    customParam = customParam.append('print', 'pretty');
    customParam = customParam.append('custom-param', 'custom-param-value');
    return this.http.get<{ [key: string]: Post }>(this.postUrl, {
      headers: new HttpHeaders({
        'custom-header' : 'hello from custom header'
      }),
      params: customParam,
    })
      .pipe(
        map(responseData => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key })
            }
          }
          return postArray;
        }),
        catchError(
          errorRes => {
            return throwError(errorRes);
          }
        )
      );
  }

  updateData(dataPost: Post) {
    const data = {[dataPost.id] : {
      title : dataPost.title,
      content: dataPost.content
    }};
    // klo pake put 1 id yang di update akan ke update semua
    // return this.http.put(this.postUrl, data);

    // kalau patch 1 id yang di update hanya 1 id aja yang akan ke update
    return this.http.patch(this.postUrl, data);
  }

  deletePost() {
    return this.http.delete(this.postUrl,{
      observe: 'events'
    }).pipe(
      tap(
        event => {
          console.log(event);
          if(event.type === HttpEventType.Sent){

          }
          if(event.type === HttpEventType.Response){
            console.log(event.body);
          }
        }
      )
    );
  }
}
