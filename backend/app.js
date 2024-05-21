const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolverspg');
const pool = require('./models/userspg');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

// Test the database connection and start the server
pool.connect()
  .then(client => {
    client.release(); // Release the client immediately
    app.listen(8000, () => {
      console.log('Connected to database and server running on port 4000');
    });
  })
  .catch(err => {
    console.error('Error connecting to the database', err.stack);
  });

