const qrcode = require("qrcode");

// This script helps generate QR codes from raw data
// Usage: node scripts/generate-qr.js "your-qr-data-here"

const qrData = process.argv[2];

if (!qrData) {
  console.log("❌ Please provide QR code data as an argument");
  console.log('Usage: node scripts/generate-qr.js "your-qr-data-here"');
  process.exit(1);
}

console.log("🔐 Generating QR code for:", qrData);
console.log("=====================================");

// Generate data URL
qrcode.toDataURL(
  qrData,
  {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  },
  (err, dataUrl) => {
    if (err) {
      console.error("❌ Error generating QR code:", err);
      return;
    }

    console.log("\n🌐 Copy and paste this URL in your browser:");
    console.log(dataUrl);
    console.log("\n📱 Or scan this QR code in console:");

    // Also show console QR code
    qrcode.generate(qrData, { small: true });
  }
);
