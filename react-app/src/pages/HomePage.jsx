import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Gray Overlay */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          bgcolor: "rgba(128, 128, 128, 0.2)",
        }}
      />

      {/* Centered Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          mt: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 2,
        }}
      >
        <Typography variant="h3" sx={{ color: "#fff", mb: 2 }}>
          AI-Assisted Post-Operative Documentation for Neurosurgery
        </Typography>
        <Typography variant="h6" sx={{ color: "#fff", mb: 4 }}>
          DGIN 5201 - Team 9
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/upload")}
          sx={{ mb: 2 }}
        >
          Get Started
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            window.open("http://localhost:9100/saved-articles", "_blank")
          }
          sx={{
            backgroundColor: "purple",
            "&:hover": { backgroundColor: "indigo" },
          }}
        >
          Show Saved Articles
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
