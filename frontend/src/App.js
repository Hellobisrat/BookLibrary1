import {Routes,Route} from 'react-router';
import HomePage from './page/HomePage';
import Navbar from './component/Navbar.jsx'
import SignUp from './page/SignUp.jsx';
import LogIn from './page/Login.jsx'
import AddBook from './page/AddBook.jsx'
import Footer from './component/Footer.jsx'
import UpdateBook from './page/UpdateBook.jsx'
import {ToastContainer} from 'react-toast'
import { useAuthStore } from './store/authStore.js';
import { useEffect } from 'react';
import RedirectAuthenticatedUser from './provider/RedirectAuthenticatedUsers.jsx'
import RedirectUnauthenticatedUser from './provider/RedirectUnauthenticatedUsers.jsx'
import Bookpage from './page/Bookpage.jsx';
import SearchPage from './component/SearchPage.jsx';
function App() {
  const {fetchUser,fetchingUser}=useAuthStore();
  useEffect(()=>{
    fetchUser();
  },
    [fetchUser])
    if(fetchingUser){
      return <p>Loading ....</p>
    }
  return (
    <> 
   
      <ToastContainer/>
      <Navbar/>
      <Routes>
        
       <Route path='/' element={<HomePage/>}/>
       <Route path='/signup' element={<RedirectAuthenticatedUser><SignUp/></RedirectAuthenticatedUser>}/>
       <Route path='/login' element={<RedirectAuthenticatedUser><LogIn /></RedirectAuthenticatedUser>}/>
       <Route path='/add-book' element={<RedirectUnauthenticatedUser><AddBook/></RedirectUnauthenticatedUser>}/>
       <Route path='/book/:id/update' element={<RedirectUnauthenticatedUser><UpdateBook/></RedirectUnauthenticatedUser>}/>
       <Route path='/book/:id' element={<Bookpage/>}/>
       <Route path='/search' element={<SearchPage/>}/>
      </Routes>
      <Footer/>
</>
  )
}
  

export default App;
