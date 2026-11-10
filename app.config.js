const fs = require("node:fs");

module.exports = ({ config }) => ({
  ...config,
  name: "Data Mahasiswa",
  slug: "mahasiswa",
  scheme: "mahasiswa",
  platforms: ["android", "web"],
  android: {
    ...config.android,
    package: "com.ppk.mahasiswa",
    ...(fs.existsSync("./google-services.json")
      ? { googleServicesFile: "./google-services.json" }
      : {}),
  },
  plugins: ["@react-native-google-signin/google-signin"],
});
