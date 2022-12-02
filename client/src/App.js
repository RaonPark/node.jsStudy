import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Account from './pages/account';
import Index from './pages';
import Home from './pages/home';
import New from './pages/new';
import Follow from './pages/follow';
import Msg from './pages/msg';
import Error from './pages/error';
import Profile from './pages/profile';
import Email from './pages/email';
import Edit from './pages/edit';

function App() {
  return (
    <>
      <main>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Index />} />
            <Route path="/account" element={<Account />} />
            <Route path="/home" element={<Home />}/>
            <Route path="/new" element={<New />}/>
            <Route path="/follow" element={<Follow />}/>
            <Route path="/msg" element={<Msg />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/email" element={<Email />}/>
            <Route path="/edit" element={<Edit />}/>
            <Route path="*" element={<Error />}/>
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
