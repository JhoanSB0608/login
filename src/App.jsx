import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './components/home';
import Login from './components/login';
import CreateAccount from './components/createAccount';
import ProductManager from './components/ProductsManager';

const router = createBrowserRouter([
  {
      path: "/",
      element: <Home />,
  },
  {
      path: "/login",
      element: <Login />
  },
  {
      path: "/create-account",
      element: <CreateAccount />
  },
  {
      path: "/manage",
      element: <ProductManager />,
  }
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;


