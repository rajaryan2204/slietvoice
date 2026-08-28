import { db } from "../lib/db";
import { verifyPassword } from "../lib/auth";

async function verify() {
  const user = await db.user.findUnique({
    where: { email: "admin@college.edu" },
  });

  if (!user) {
    console.error("Admin user not found!");
    process.exit(1);
  }

  const isMatch = await verifyPassword("Aryan2204*", user.passwordHash);
  console.log(`User: ${user.name} (${user.email})`);
  console.log(`Role: ${user.role}`);
  console.log(`Password verification: ${isMatch ? "SUCCESS ✓" : "FAILED ✗"}`);
}

verify()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
