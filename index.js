const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Password = require("./models/Password");
const Log = require("./models/Log");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());

mongoose
  .connect(
    "mongodb+srv://rishabhkumarsingh13:iot123@cluster0.34z8u.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Unlock API
app.post("/api/unlock", async (req, res) => {
  const { password } = req.body;

  try {
    const storedPassword = await Password.findOne();
    const success = storedPassword && storedPassword.password === password;

    // Log the attempt
    await Log.create({ passwordAttempt: password, success });

    if (success) {
      // Signal ESP32
      return res.json({ success: true });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  } catch (error) {
    console.error("Error unlocking:", error);
    res.status(500).send("Server error");
  }
});

// Change Password API
app.post("/api/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const storedPassword = await Password.findOne();
    if (storedPassword && storedPassword.password === currentPassword) {
      await Password.setPassword(newPassword);
      return res.json({
        success: true,
        message: "Password changed successfully",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid current password" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Server error");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));