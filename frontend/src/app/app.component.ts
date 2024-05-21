import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { query } from 'express';
import { Router }  from "@angular/router"
import gql from 'graphql-tag';
import { Observable } from 'rxjs'; 
import { map, catchError} from 'rxjs/operators';

const GET_USERS = gql`
{
  users {
    users {
      _id
      email
      name
    }
  }
}
`;
const CREATE_USER = gql`
mutation createUser($userInput: UserInputData!) {
  createUser(userInput: $userInput) {
    _id
    email
    name
  }
}
`;

const DELETE_USER = gql`
mutation deleteUser($id: Int!) {
  deleteUser(id: $id) {
    _id
    email
    name
  }

}
`;
const GET_USER_BY_ID = gql`
  query getUserById($id: Int!) {
    user(id: $id) {
      _id
      email
      name
    }
  }
`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'frontend';

  users!: Observable<any>;


  constructor (private apollo: Apollo, private router: Router) {}

  ngOnInit() {
    this.users = this.apollo.watchQuery<any>({
      query: GET_USERS
    })
    .valueChanges
    .pipe(
      map((result) => result.data.users.users)
    );
  }
  
  // createQuote(quote: string, author: string) {
  //   this.apollo.mutate({
  //     mutation: CREATE_QUOTE,
  //     variables: {
  //       quote,
  //       author
  //     },
  //     refetchQueries: [{
  //       query: GET_QUOTES
  //     }]
  //   }).subscribe();
  // }
  createUser(email: string, name: string) {
    this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {
        userInput: {
          email,
          name
        }
      },
      refetchQueries: [{
        query: GET_USERS
      }]
    }).subscribe();
  }

  deleteUser(id: number) {
    console.log(id);
    this.apollo.mutate({
      mutation: DELETE_USER,
      variables: {
        id: id 
      },
      refetchQueries: [{
        query: GET_USERS
      }]
    }).subscribe();
  }

  gotoEdit(page: string) {
    this.router.navigate([`${page}`]);
  }

}

