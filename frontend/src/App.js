import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authetication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';
import HomeComponent from './pages/Home';
import History from './pages/history';
function App() {
  return (
<>
<Router>
  <AuthProvider>  <Routes>
    <Route path="/" element={<LandingPage></LandingPage>}></Route>
    <Route path='/history' element={<History></History>}></Route>
    <Route path="/home" element={<HomeComponent></HomeComponent>}></Route>
    <Route path="/auth" element={<Authentication></Authentication>}></Route>
    <Route path="/:url" element={<VideoMeetComponent></VideoMeetComponent>}></Route>
  </Routes>
  </AuthProvider>

</Router>
</>
  );
}

export default App;
