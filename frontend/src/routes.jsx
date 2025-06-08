import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./App";
import FilmPage from "./Film";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/film/:filmId" element={<FilmPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;