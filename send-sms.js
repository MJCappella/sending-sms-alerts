require("dotenv").config();
const mysql = require("mysql2/promise");
const axios = require("axios");

const { dbConfig, leopardSmsApiConfig } = require("./configs/configs");

const targetLocation = "kisumu";
const messageText =
  "A flood has been reported in your area. Reply with 1 to confirm or 2 to report a false alert.";

async function fetchPhoneNumbersByLocation(location) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT phone_number FROM users WHERE location = ?",
      [location]
    );

    await connection.end();

    return rows.map((row) => row.phone_number);
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

async function sendSms(phoneNumber, message) {
  const url = `${leopardSmsApiConfig.apiUrl}?username=${
    leopardSmsApiConfig.username
  }&password=${leopardSmsApiConfig.password}&message=${encodeURIComponent(
    message
  )}&destination=${phoneNumber}&source=${leopardSmsApiConfig.senderId}`;

  try {
    const response = await axios.get(url);

    if (response.data.success) {
      console.log(`SMS sent successfully to ${phoneNumber}`);
    } else {
      console.error(
        `Failed to send SMS to ${phoneNumber}: ${
          response.data ? response.data.message : "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error(`Error sending SMS to ${phoneNumber}:`, error.message);
    // console.log("Request URL:", url);
  }
}

async function sendAlerts() {
  const phoneNumbers = await fetchPhoneNumbersByLocation(targetLocation);

  if (phoneNumbers.length === 0) {
    console.log("No users found in the specified location.");
    return;
  }

  for (const phoneNumber of phoneNumbers) {
    try {
      await sendSms(phoneNumber, messageText);
    } catch (error) {
      console.error(`Unhandled error for ${phoneNumber}:`, error.message);
    }
  }
}

// Start sending alerts
sendAlerts();
