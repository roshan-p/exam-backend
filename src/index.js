import { ApolloServer, gql, PubSub } from 'apollo-server-express';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';

const SERVER_PORT = 4000;
const DB_URI = "mongodb+srv://apptest:apptest@cluster0.rwfzr.gcp.mongodb.net/ChatApp?retryWrites=true&w=majority";
const app = express();
const pubsub = new PubSub();


app.use(
  cors({ 
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const apolloServer = new ApolloServer({
  typeDefs: gql`
    ${typeDefs}
  `,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

const db = async () => {
  try {
    const success = await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('DB Connected');
  } catch (error) {
    console.log('DB Connection Error', error);
  }
};
db();


apolloServer.applyMiddleware({ app, cors: { origin: 'http://localhost:3000' } });

const httpserver = http.createServer(app);

apolloServer.installSubscriptionHandlers(httpserver);

app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.get('/', function (req, res) {
  res.json({
    data: 'BLANK PAGE !'
  });
});

app.get('/rest', function (req, res) {
  res.json({
    data: 'Hit rest end point!'
  });
});


httpserver.listen({ port: SERVER_PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${SERVER_PORT} let's start!`)
  console.log(`🚀 Apollo is ready at http://localhost:${SERVER_PORT}${apolloServer.graphqlPath} let's start!`)
  console.log(`🚀 Subscription is ready at http://localhost:${SERVER_PORT}${apolloServer.subscriptionsPath} let's start!`)
})
