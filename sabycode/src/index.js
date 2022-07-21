import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {rootStore} from './redux/rootStore'; 
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 // <React.StrictMode> 
 /* временно закомментировала из-за того, что при StrictMode в dev режиме
  useEffect срабатывает дважды (из-за чего соединение с сокетом устанавливается дважды) */
    <Provider store={rootStore}>
      <App />
    </Provider>
  //</React.StrictMode>
);

reportWebVitals();
