import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Actuality from "./pages/Actuality";
import Contact from "./pages/Contact";
import ScrollToTop from "./utils/ScrollToTop";
import Page404 from "./pages/404";
import About from "./pages/About";
import Travaux from "./pages/Travaux";
import Unsubscribe from "./pages/Unsubscribe";
import MentionsLegales from "./pages/MentionsLegales";
import Don from "./pages/Don";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";
import AdminAccessGate from "./components/AdminAccessGate";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/actualities" element={<Actuality />} />
        <Route path="/travaux" element={<Travaux />} />
        <Route path="/don" element={<Don />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/admin" element={<AdminAccessGate><Admin /></AdminAccessGate>} />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
