import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Divide en dos entradas: core y react
import * as ApolloCore from '@apollo/client';
import * as ApolloReact from '@apollo/client/react';

// Toma los símbolos de cada paquete correcto
const { ApolloClient, InMemoryCache, HttpLink } = ApolloCore;
const { ApolloProvider } = ApolloReact;

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:8080/graphql',
  }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

