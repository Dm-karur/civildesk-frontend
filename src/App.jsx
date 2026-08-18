import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { Toaster } from './components/composite/Toast';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
