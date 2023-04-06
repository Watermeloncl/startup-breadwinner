import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './Login';
import { Home } from './Home';
import { Play } from './Play';
import { Tutorial } from './Tutorial';
import { Leaderboard } from './Leaderboard';

function App() {
  return (
    <div id="body">
      <header>
        <p id="indexTopTitle" className="mainTitle">Breadwinner!</p>
      </header>

      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/play' element={<Play/>}/>
        <Route path='/tutorial' element={<Tutorial/>}/>
        <Route path='/leaderboard' element={<Leaderboard/>}/>
        <Route path='*' element={<NotFound/>}/>

        {/*<Route path='/' element={<Login userName={userName} authState={authState} onAuthChange={(userName, authState) => {setAuthState(authState); setUserName(userName); }} />} exact/>
        <Route path='/play' element={<Play userName={userName} />} />
        <Route path='/scores' element={<Scores />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<NotFound />} />*/}
      </Routes>

      <footer>
        <p id="author">Created by Devin Frandsen</p>
        <p id="source"><a href="https://github.com/Watermeloncl/startup-breadwinner">Source</a></p>
      </footer>
    </div>
  );
}

function NotFound() {
  return <main>404: Return to sender. Address unknown.</main>;
}

export default App;