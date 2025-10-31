import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import * as Apollo from '@apollo/client';
const { ApolloProvider } = Apollo;

import { client } from './apollo/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
