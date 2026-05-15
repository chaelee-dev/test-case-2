import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar.js';
import { Footer } from '../components/Footer.js';

export function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
