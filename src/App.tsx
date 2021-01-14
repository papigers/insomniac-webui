import Header from './components/Header/Header';
import Main from './components/Main/Main';
import { BrowserRouter as Router } from 'react-router-dom';
import ApiContext from 'ApiContext';

export default function App() {
  return (
    <ApiContext>
      <Router>
        <Header />
        <Main />
      </Router>
    </ApiContext>
  );
}
