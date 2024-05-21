const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: Int
        email: String!
        name: String!
    }

    type UserData {
        users: [User!]!
    }
    input UserInputData{
        email: String!
        name: String!
    }

    type RootQuery {
        users: UserInputData!
        user(id: Int!): User!
    }
    type RootMutation {
        createUser(userInput: UserInputData): User!
        updateUser(id: Int, userInput: UserInputData): User!
        deleteUser(id: Int): User!
      }
      schema {
        query: RootQuery
        mutation: RootMutation
      }
`);
