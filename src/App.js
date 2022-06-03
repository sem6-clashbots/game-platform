import './App.scss';
import Header from './scripts/Header'
import Main from './scripts/Main'
import Footer from './scripts/Footer'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
      </header>
    </div>
  );
}

export default App;
