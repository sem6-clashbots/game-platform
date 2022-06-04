import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import './App.scss';

import Header from './scripts/Header'
import Footer from './scripts/Footer'
import Main from './scripts/Main'
import API from './scripts/API'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Header></Header>
          <Routes>
            <Route exact path='/' element={< Main />}></Route>
            <Route exact path='/api' element={< API />}></Route>
          </Routes>
          <Footer></Footer>
        </header>
      </div>
    </Router>
  );
}

export default App;
