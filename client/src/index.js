import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import store from './store/store';
// import {setUser} from './features/user/userSlice';
import {jwtDecode} from 'jwt-decode';
import { createRoot } from 'react-dom/client';

// if (localStorage.getItem('token')) {
//   const decoded = jwtDecode(localStorage.getItem('token'));
//   store.dispatch(setUser(decoded));
// }

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
