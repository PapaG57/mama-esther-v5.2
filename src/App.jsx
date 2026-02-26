import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import Footer from "./components/Footer";
import AdminAccessGate from "./components/AdminAccessGate";
import ScrollToTopButton from "./components/ScrollToTopButton";
import HandSpinner from "./components/HandSpinner";

// Lazy loading pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Actuality = lazy(() => import("./pages/Actuality"));
const Travaux = lazy(() => import("./pages/Travaux"));
const Don = lazy(() => import("./pages/Don"));
const Contact = lazy(() => import("./pages/Contact"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Admin = lazy(() => import("./pages/Admin"));
const Page404 = lazy(() => import("./pages/404"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToTopButton />
      <Suspense fallback={<HandSpinner />}>
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
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
