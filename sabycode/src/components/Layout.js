import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout(props) {
  return (
    <>
      <Header/>
      <main className="main">
          <Outlet />
      </main>
    </>
  );
}