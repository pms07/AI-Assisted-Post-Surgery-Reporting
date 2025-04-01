import React, { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TranscriptionPage = ({ transcribedText, setGeneratedReport }) => {
  const [customInput, setCustomInput] = useState("");
  const navigate = useNavigate();

  const generateReport = async () => {
    const prompt = `Given the transcription: "${transcribedText}" and user input: "${customInput}", generate a structured report.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "system", content: prompt }],
        },
        { headers: { Authorization: `Bearer YOUR_OPENAI_API_KEY` } }
      );
      setGeneratedReport(response.data.choices[0].message.content);
      navigate("/report");
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5">Transcribed Text</Typography>
      <Typography>{transcribedText}</Typography>

      <TextField
        label="Add Custom Input"
        fullWidth
        onChange={(e) => setCustomInput(e.target.value)}
      />
      <Button onClick={generateReport}>Generate Report</Button>
    </Container>
  );
};

export default TranscriptionPage;
