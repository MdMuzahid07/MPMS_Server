/* eslint-disable no-console */
import mongoose from "mongoose";

import config from "./app/config";
import { UserModel } from "./app/modules/auth/auth.model";

const seedAdmin = async () => {
  try {
    // ======= Validation =======
    if (!config.database_url) {
      throw new Error("DATABASE_URL is missing in the configuration.");
    }

    // ======= Connect =======
    await mongoose.connect(config.database_url as string);
    console.log("🌱 Database connected for seeding...");

    // ======= Define Credentials =======
    const adminName = process.argv[2] || config.admin_name || "Super Admin";
    const adminEmail = process.argv[3] || config.admin_email || "onyx.admin@gmail.com";
    const adminPassword = process.argv[4] || config.admin_password || "Onyx@Admin12345";

    // ======= Check Existence =======
    const userExists = await UserModel.findOne({
      $or: [{ email: adminEmail }, { role: "admin" }],
    });

    if (userExists) {
      console.log("⚠️  Admin already exists. Seeding skipped.");
    } else {
      // ======= Create Admin =======
      // Plain password — pre-save hook hashes it
      await UserModel.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        isActive: true,
        isDeleted: false,
      });

      console.log("✅ Admin created successfully!");
      console.log(`👤 Name    : ${adminName}`);
      console.log(`📧 Email   : ${adminEmail}`);
      console.log(`🔑 Password: [HIDDEN]`);
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  } finally {
    // ======= Graceful Shutdown =======
    await mongoose.disconnect();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  }
};

seedAdmin();
