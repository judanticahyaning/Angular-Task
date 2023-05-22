import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from 'src/model/post.model';
import { PostService } from './service/post.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('showUpdate') showUpdate: NgForm;

  loadedPosts = [];
  showLoading = false;
  error = null;
  errorSub : Subscription;

  constructor(
    private postService: PostService,
    private httpClient : HttpClient
  ) {}

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe(
      error => {
        this.error = error;
      }
    );
  }

  ngOnDestroy():void{
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: Post){
    this.postService.createAndPost(postData);
  }

  onUpdatePost(postData: Post){
    console.log(postData);
    this.postService.updateData(postData).subscribe(
      dataUpdate => {
        console.log(dataUpdate)
      }
    );
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.showLoading = true;
    this.postService.deletePost().subscribe(
      (data) => {
        this.showLoading = false;
        this.loadedPosts = [];
      }
    )
  }

  showDataUpdate(data: Post){
    console.log(data);
    this.showUpdate.setValue({
      id: data.id,
      title: data.title,
      content: data.content
    });
    console.log(this.showUpdate);
  }

  private fetchPosts(){
    // this.http.get(this.postUrl).subscribe(
    //   posts => {
    //     console.log(posts);
    //   }
    // );

    this.showLoading = true;
    this.postService.fetchData()
      .subscribe(
        post => {
          this.showLoading = false;
          this.loadedPosts = post;
        },
        error => {
          this.showLoading = false;
          console.log(error);
          this.error = error;
        }
      );
    // this.http.get<{[key: string]: Post}>(this.postUrl)
    //   .pipe(
    //     map( responseData => {
    //       const postArray : Post[] = [];
    //       for (const key in responseData){
    //         if(responseData.hasOwnProperty(key)){
    //           postArray.push({...responseData[key], id:key})
    //         }
    //       }
    //       return postArray;
    //     })
    //   ).subscribe(
    //     posts => {
    //       console.log(posts);
    //       this.showLoading = false;
    //       this.loadedPosts = posts;
    //     }
    //   )
  }

}
