import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Apollo: separa core y react para evitar conflictos de exports
import * as ApolloCore from '@apollo/client';
import * as ApolloReact from '@apollo/client/react';

const { ApolloClient, InMemoryCache, HttpLink } = ApolloCore;
const { ApolloProvider } = ApolloReact;

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphql-backend-0fnu.onrender.com/graphql',
    // Si tu backend usa cookies/sesión, descomenta:
    // credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);