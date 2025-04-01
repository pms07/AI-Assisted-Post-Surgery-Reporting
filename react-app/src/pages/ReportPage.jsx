import React, { useRef, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, report } = location.state || {};
  const reportRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handlePrintPDF = () => {
    if (reportRef.current) {
      const content = reportRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h4 { margin-bottom: 20px; }
              p { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onload = function () {
        printWindow.print();
      };
    }
  };

  const handleSaveToDatabase = async () => {
    try {
      const response = await fetch("http://localhost:9200/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article_title: fileName,
          article_data: report,
        }),
      });
      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Article saved successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to save article.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error saving article:", error);
      setSnackbar({
        open: true,
        message: "Error saving article.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <div ref={reportRef} style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          {fileName || "Report"}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 4 }}>
          {report || "No report generated."}
        </Typography>
      </div>
      <Button
        variant="contained"
        onClick={handlePrintPDF}
        sx={{ mr: 2, backgroundColor: "blue", "&:hover": { backgroundColor: "darkblue" } }}
      >
        Print as PDF
      </Button>
      <Button
        variant="contained"
        onClick={handleSaveToDatabase}
        sx={{ mr: 2, backgroundColor: "green", "&:hover": { backgroundColor: "darkgreen" } }}
      >
        Save for Later Use
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ backgroundColor: "red", "&:hover": { backgroundColor: "darkred" } }}
      >
        Back to Home
      </Button>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportPage;
