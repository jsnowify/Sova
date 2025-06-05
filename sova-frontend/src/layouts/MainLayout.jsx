import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar"; // Adjust path if necessary

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* The Outlet component will render the matched child route's element */}
        <Outlet />
      </main>
      <footer className="bg-black text-white text-center p-4 text-sm">
        &copy; {new Date().getFullYear()} Sova. All Rights Reserved.
      </footer>
    </div>
  );
}
