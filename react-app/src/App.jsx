import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import TranscriptionPage from "./pages/TranscriptionPage";
import ReportPage from "./pages/ReportPage";
import SavedArticlesPage from "./pages/SavedArticlesPage"; // New import

const AppRoutes = ({
  setTranscribedText,
  setGeneratedReport,
  transcribedText,
  generatedReport,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/upload"
          element={<UploadPage setTranscribedText={setTranscribedText} />}
        />
        <Route
          path="/transcription"
          element={
            <TranscriptionPage
              transcribedText={transcribedText}
              setGeneratedReport={setGeneratedReport}
            />
          }
        />
        <Route path="/report" element={<ReportPage generatedReport={generatedReport} />} />
        <Route path="/saved-articles" element={<SavedArticlesPage />} /> {/* New Route */}
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [transcribedText, setTranscribedText] = useState("");
  const [generatedReport, setGeneratedReport] = useState("");

  return (
    <Router>
      <AppRoutes
        setTranscribedText={setTranscribedText}
        setGeneratedReport={setGeneratedReport}
        transcribedText={transcribedText}
        generatedReport={generatedReport}
      />
    </Router>
  );
};

export default App;
