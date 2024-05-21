import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Router }  from "@angular/router"

const GET_USER_BY_ID = gql`
  query getUserById($id: Int!) {
    user(id: $id) {
      _id
      email
      name
    }
  }
`;
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
const UPDATE_USER = gql`
  mutation updateUser($id: Int!, $userInput: UserInputData!) {
    updateUser(id: $id, userInput: $userInput) {
      _id
      email
      name
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

interface User {
  id: number;
  name: string;
  email: string;
}


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  user!: Observable<any>;
  user_id: any;
  // email: string = ''; // declare 'email' property
  // name: string = ''; 

  constructor(private apollo: Apollo, private route: ActivatedRoute, private router: Router) {}

  // ngOnInit() {
  //   this.route.params.subscribe(params => {
  //     this.user_id = +params['id'];
  //     console.log(this.user_id);
  //     const res = this.apollo.watchQuery<any>({
  //       query: GET_USER_BY_ID,
  //       variables: { id: this.user_id}
  //     })
  //     .valueChanges
  //     .pipe(
  //       map((result) => result.data.user)
  //     );
  //   });
  // }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user_id = +params['id'];
      console.log(this.user_id);
      this.user = this.apollo.watchQuery<{ user: User }>({
        query: GET_USER_BY_ID,
        variables: { id: this.user_id }
      })
      .valueChanges
      .pipe(
        map(result => [result.data.user]),
        catchError(error => {
          console.error('Error fetching user data', error);
          throw error;
        })
      );
    });
  }
  updateUser(id: number, email: string, name: string) {
    // this.email = _email;
    // this.name = _name;
    this.apollo.mutate({
      mutation: UPDATE_USER,
      variables: {
        id,
        userInput: {
          email,
          name
        }
      },
      refetchQueries: [{
        query: GET_USERS
      }]
    }).subscribe();
    this.router.navigate([`/`]);
  
  }
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
}
