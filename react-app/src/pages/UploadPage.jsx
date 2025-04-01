import React, { useState } from "react";
import { Box, Typography, Button, Card, CircularProgress, TextField } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const UploadPage = ({ setTranscribedText }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [customInput, setCustomInput] = useState(
    "Generate a detailed report on above transcription with following heads as DATE OF PROCEDURE, OPERATOR, ASSISTANTS, ANESTHETIST, PREOPERATIVE DIAGNOSIS, POSTOPERATIVE DIAGNOSIS, NAME OF PROCEDURE(S), COMPLICATIONS, ANESTHETIC, ESTIMATED BLOOD LOSS,PATHOLOGY,INDICATIONS,DESCRIPTION OF PROCEDURE,HEMOSTASIS AND CLOSURE, and give title as 'AI-Assisted Post-Operative Documentation for Neurosurgery' in bold letters"
  );

  // Configure react-dropzone to accept only audio files
  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select an audio file.");
      return;
    }
    setLoading(true); // Start loading UI

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
          },
        }
      );
      setTranscript(response.data.text);
      setTranscribedText(response.data.text);
      setLoading(false); // Hide the "Transcribing..." loader after transcript is received.
    } catch (error) {
      console.error("Error transcribing file:", error);
      setLoading(false); // On error, restore UI so user can retry.
    }
  };

  const handleGenerateReport = async () => {
    if (!customInput.trim()) {
      alert("Please enter some custom input.");
      return;
    }
    setReportLoading(true); // Show the full-page loader
    try {
      const prompt = `Using the following transcription:\n${transcript}\nAnd the additional input:\n${customInput}\nGenerate a detailed report.`;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "system", content: prompt }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
          },
        }
      );
      const reportText = response.data.choices[0].message.content;
      setReportLoading(false); // Hide the report loader
      // Navigate to the Report page, passing file name and report via state.
      navigate("/report", { state: { fileName: file.name, report: reportText } });
    } catch (error) {
      console.error("Error generating report:", error);
      setReportLoading(false); // Hide the loader in case of error
    }
  };

  return (
    <>
      {reportLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ color: "white", mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      )}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
          {/* Left Side: File Upload / Loading UI */}
          <Box
            sx={{
              width: "40%",
              bgcolor: "black",
              color: "white",
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!loading ? (
              <>
                <Typography variant="h4" gutterBottom>
                  Upload File
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Please upload your audio file for transcription.
                </Typography>

                <Box
                  {...getRootProps()}
                  sx={{
                    mt: 3,
                    mb: 3,
                    width: "89%",
                    p: 4,
                    border: "2px dashed #ccc",
                    borderRadius: 1,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    color: "#000",
                  }}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <Typography variant="body1">{file.name}</Typography>
                  ) : (
                    <Typography variant="body1">
                      Drag 'n' drop an audio file here
                    </Typography>
                  )}
                </Box>

                <Button variant="contained" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    mt: 2,
                    backgroundColor: "red",
                    ":hover": { backgroundColor: "darkred" },
                  }}
                >
                  Back
                </Button>
              </>
            ) : (
              // Loading UI after submission
              <Box sx={{ textAlign: "center" }}>
                {/* Animated file name */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h5">{file && file.name}</Typography>
                </motion.div>
                {/* Loading card */}
                <Card sx={{ mt: 2, p: 2, width: "100%" }}>
                  <Typography variant="body1">Transcribing...</Typography>
                  <CircularProgress sx={{ mt: 1 }} />
                </Card>
              </Box>
            )}
          </Box>

          {/* Right Side: Transcript & Report Generation */}
          <Box
            sx={{
              width: "60%",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {transcript ? (
              // After transcript is received, show white background with two sections
              <Box sx={{ width: "100%", height: "100%", bgcolor: "white", color: "black", p: 2 }}>
                {/* Top Section: Transcript Display (60% height) */}
                <Box
                  sx={{
                    height: "60%",
                    overflowY: "auto",
                    borderBottom: "1px solid #ccc",
                    pb: 2,
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Transcription
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {transcript}
                  </Typography>
                </Box>

                {/* Bottom Section: Report Generation (40% height) */}
                <Box
                  sx={{
                    height: "40%",
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    label="Custom Input"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" onClick={handleGenerateReport}>
                    Generate Report
                  </Button>
                </Box>
              </Box>
            ) : (
              // Until transcript is received, show a gray overlay with no custom input area.
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "gray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" color="white">
                  Waiting for transcription...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </motion.div>
    </>
  );
};

export default UploadPage;
