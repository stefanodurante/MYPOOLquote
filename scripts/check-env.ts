const required = ["DATABASE_URL", "BETTER_AUTH_SECRET", "STAFF_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Environment configuration is valid.");
