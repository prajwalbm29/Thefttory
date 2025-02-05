import { RouterProvider } from 'react-router-dom';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UseSession } from './context/sessionContext';
import { useEffect, useState } from 'react';

function App() {
    const {isLoggedIn} = UseSession();
    const [forceRender, setForceRender] = useState(false);

    useEffect(() => {
      console.log("Login status in App ", isLoggedIn);
      setForceRender(prev => !prev);
    }, [isLoggedIn])

    return <RouterProvider router={router} key={forceRender} />
}

export default App;
