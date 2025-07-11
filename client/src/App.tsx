import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout' 
import Welcome from './Components/Welcome/WelcomePage'
import SignUp from './Components/SignUp/SignUp'
import Login from './Components/LoginPage/LoginPage'
import AboutPage from './Components/About/about'  
import Call from './Components/Call/Call'
import NewsandEvents from './Components/NewsandEvents/NewsandEvents'
import  Events  from './Components/Events/Events'
import News from './Components/News/News'
import CreateEvent from './Components/CreateEvent/CreateEvent';
import './App.css'
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Welcome />} />
              <Route path="/*" element={<Welcome />} />
              <Route path="/newsandevents" element={<NewsandEvents />} />
              <Route path="/events" element={<Events />} />
              <Route path="/news" element={<News />} />
              <Route path="/createevent" element={<CreateEvent />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App;