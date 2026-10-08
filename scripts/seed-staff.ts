import fs from "node:fs";

if (!process.env.DATABASE_URL && fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const separator = line.indexOf("=");
    if (separator > 0) {
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      if (key && value && !process.env[key]) process.env[key] = value;
    }
  }
}

const email = process.env.STAFF_EMAIL ?? "staff@mypoolquote.local";
const password = process.env.STAFF_PASSWORD;
const name = process.env.STAFF_NAME ?? "MYPOOL Staff";

async function main() {
  if (!password) {
    throw new Error("Set STAFF_PASSWORD before running the staff seed.");
  }

  const { auth } = await import("../lib/auth");
  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  console.log(`Staff user created: ${email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
