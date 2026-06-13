/* eslint-disable no-console */
import mongoose from "mongoose";

import config from "./app/config";
import { ActivityLogModel } from "./app/modules/activity/activity.model";
import { CommentModel } from "./app/modules/comment/comment.model";
import { ProjectModel } from "./app/modules/project/project.model";
import { SprintModel } from "./app/modules/sprint/sprint.model";
import { TaskModel } from "./app/modules/task/task.model";
import { TimeLogModel } from "./app/modules/timelog/timelog.model";
import { UserModel } from "./app/modules/user/user.model";

const seedDatabase = async () => {
  try {
    // ======= Validation =======
    if (!config.database_url) {
      throw new Error("DATABASE_URL is missing in the configuration.");
    }

    // ======= Connect =======
    console.log("🌱 Connecting to database for seeding...");
    await mongoose.connect(config.database_url as string);
    console.log("🔌 Connected successfully!");

    // ======= Clean Reset =======
    console.log("🧹 Performing clean database reset...");
    await CommentModel.deleteMany({});
    await TimeLogModel.deleteMany({});
    await ActivityLogModel.deleteMany({});
    await TaskModel.deleteMany({});
    await SprintModel.deleteMany({});
    await ProjectModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log("✨ Reset complete!");

    // ======= 1. Seed Users (20 Users) =======
    console.log("👤 Seeding 20 Users...");

    const adminPassword = config.admin_password || "MPMS@Admin12345";
    const userPassword = "MPMS@User123";

    const usersData = [
      // Admin (Male)
      {
        name: config.admin_name || "Super Admin",
        email: config.admin_email || "mpms.admin@gmail.com",
        password: adminPassword,
        role: "admin",
        status: "active",
        department: "Executive Management",
        skills: ["Operations", "Strategic Planning", "Leadership"],
        avatar:
          "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=256&h=256&q=80",
        isActive: true,
        isDeleted: false,
      },
      // Managers (4 Users: 2 Male, 2 Female -> Cat)
      {
        name: "Sarah Jenkins",
        email: "sarah.jenkins@company.com",
        password: userPassword,
        role: "manager",
        status: "active",
        department: "Product Management",
        skills: ["Agile", "Scrum", "Product Roadmapping", "Jira"],
        avatar:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Michael Chen",
        email: "michael.chen@company.com",
        password: userPassword,
        role: "manager",
        status: "active",
        department: "Engineering",
        skills: ["Project Management", "Technical Leadership", "System Architecture"],
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Sophia Rodriguez",
        email: "sophia.rodriguez@company.com",
        password: userPassword,
        role: "manager",
        status: "active",
        department: "Product Design",
        skills: ["User Experience", "Design Ops", "Product Strategy"],
        avatar:
          "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "William Harrison",
        email: "william.harrison@company.com",
        password: userPassword,
        role: "manager",
        status: "active",
        department: "DevOps & Infrastructure",
        skills: ["Cloud Architecture", "Kubernetes", "AWS Planning", "Budgeting"],
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Victoria Regina",
        email: "victoria.regina@company.com",
        password: userPassword,
        role: "manager",
        status: "active",
        department: "Information Security",
        skills: ["Risk Assessment", "Penetration Testing", "Security Compliance"],
        avatar:
          "https://images.unsplash.com/photo-1535268647977-a403b69fc756?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },

      // Members (14 Users: 7 Male, 7 Female -> Cat)
      {
        name: "David Kim",
        email: "david.kim@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Engineering",
        skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "Redux"],
        avatar:
          "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Emma Watson",
        email: "emma.watson@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Engineering",
        skills: ["Node.js", "Express", "MongoDB", "Mongoose", "Redis"],
        avatar:
          "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Alex Rivera",
        email: "alex.rivera@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Engineering",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Elena Rostova",
        email: "elena.rostova@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Engineering",
        skills: ["React Native", "Swift", "Kotlin", "Firebase"],
        avatar:
          "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Liam O'Connor",
        email: "liam.oconnor@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Quality Assurance",
        skills: ["Cypress", "Selenium", "Jest", "Load Testing"],
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Aisha Patel",
        email: "aisha.patel@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Quality Assurance",
        skills: ["Automation Testing", "API Testing", "Postman", "CI/CD"],
        avatar:
          "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "James Carter",
        email: "james.carter@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Design",
        skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "UI/UX"],
        avatar:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Lily Nguyen",
        email: "lily.nguyen@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Design",
        skills: ["UI Design", "Design Systems", "Motion Graphics", "Illustrator"],
        avatar:
          "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Nathaniel Foster",
        email: "nathaniel.foster@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Engineering",
        skills: ["Go", "gRPC", "Docker", "Kubernetes", "Microservices"],
        avatar:
          "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Grace Hopper",
        email: "grace.hopper@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Engineering",
        skills: ["COBOL", "Compiler Construction", "System Programming"],
        avatar:
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Oliver Twist",
        email: "oliver.twist@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Design",
        skills: ["Web Design", "Typography", "Illustrations", "Creative Suite"],
        avatar:
          "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Clara Barton",
        email: "clara.barton@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Quality Assurance",
        skills: ["Automation frameworks", "Regression audits", "Security QA"],
        avatar:
          "https://images.unsplash.com/photo-1513360309081-36f5e878498a?auto=format&fit=crop&w=256&h=256&q=80", // Cat
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Arthur Pendragon",
        email: "arthur.pendragon@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Engineering",
        skills: ["Rust", "Wasm", "Performance Optimization", "Linux Kernel"],
        avatar:
          "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
      {
        name: "Marcus Aurelius",
        email: "marcus.aurelius@company.com",
        password: userPassword,
        role: "member",
        status: "active",
        department: "Design",
        skills: ["Design Philosophy", "Brand Guidelines", "Corporate Styling"],
        avatar:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&h=256&q=80", // Male
        isActive: true,
        isDeleted: false,
      },
    ];

    const users = await UserModel.create(usersData);
    console.log(`✅ Seeded ${users.length} users successfully!`);

    // Helper map to quickly find users by email
    const uMap = new Map(users.map((u) => [u.email, u._id]));

    // ======= 2. Seed Projects (6 Projects) =======
    console.log("📂 Seeding 6 Projects...");
    const projectsData = [
      {
        title: "Acme E-Commerce Redesign",
        client: "Acme Corp",
        description:
          "Migrate the legacy Magento storefront to Next.js + TailwindCSS with a headless Shopify backend. Includes building a new checkout flow, optimizing LCP/INP scores, and adding support for multiple currencies.",
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days remaining
        budget: 75000,
        status: "active",
        thumbnail:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        members: [
          uMap.get("sarah.jenkins@company.com"),
          uMap.get("david.kim@company.com"),
          uMap.get("emma.watson@company.com"),
          uMap.get("james.carter@company.com"),
          uMap.get("liam.oconnor@company.com"),
        ],
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },
      {
        title: "Nova Mobile Tracking App",
        client: "Nova Health",
        description:
          "Build a cross-platform React Native mobile tracking application to monitor patient vitals in real-time, integrating with BLE medical sensors and providing push notifications and offline storage.",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days remaining
        budget: 120000,
        status: "active",
        thumbnail:
          "https://images.unsplash.com/photo-1526253038957-bce54e05968e?auto=format&fit=crop&w=800&q=80",
        members: [
          uMap.get("michael.chen@company.com"),
          uMap.get("elena.rostova@company.com"),
          uMap.get("alex.rivera@company.com"),
          uMap.get("lily.nguyen@company.com"),
          uMap.get("aisha.patel@company.com"),
        ],
        createdBy: uMap.get("michael.chen@company.com"),
      },
      {
        title: "Helix Analytics Dashboard",
        client: "Helix Global",
        description:
          "Create an internal real-time operations dashboard utilizing WebSockets and modern data visualization techniques to aggregate system health, active user counts, and transaction logs across multiple cloud regions.",
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        endDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago (Completed)
        budget: 45000,
        status: "completed",
        thumbnail:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        members: [
          uMap.get("sophia.rodriguez@company.com"),
          uMap.get("david.kim@company.com"),
          uMap.get("emma.watson@company.com"),
          uMap.get("aisha.patel@company.com"),
        ],
        createdBy: uMap.get("sophia.rodriguez@company.com"),
      },
      {
        title: "Stellar Cloud Migrator",
        client: "Stellar Systems",
        description:
          "Relocate on-premise relational databases and legacy application services to AWS. Plan cloud network subnets, execute data transfer via AWS Snowball, verify server connectivity, and configure auto-scaling.",
        startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days remaining
        budget: 150000,
        status: "active",
        thumbnail:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        members: [
          uMap.get("william.harrison@company.com"),
          uMap.get("nathaniel.foster@company.com"),
          uMap.get("grace.hopper@company.com"),
          uMap.get("clara.barton@company.com"),
        ],
        createdBy: uMap.get("william.harrison@company.com"),
      },
      {
        title: "Quantum Security Audit",
        client: "Quantum Cryptics",
        description:
          "Perform complete penetration testing and static code security audits across client's payment infrastructure, identify vulnerability vectors, and recommend mitigation steps.",
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days remaining
        budget: 60000,
        status: "active",
        thumbnail:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        members: [
          uMap.get("victoria.regina@company.com"),
          uMap.get("arthur.pendragon@company.com"),
          uMap.get("liam.oconnor@company.com"),
          uMap.get("aisha.patel@company.com"),
        ],
        createdBy: uMap.get("victoria.regina@company.com"),
      },
      {
        title: "Zenith CRM Portal",
        client: "Zenith Inc",
        description:
          "Build a customized customer relationship management portal with live charts, sales pipeline stages, lead tracking, and third-party email notifications integration.",
        startDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 150 days ago
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (Completed)
        budget: 95000,
        status: "completed",
        thumbnail:
          "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
        members: [
          uMap.get("sarah.jenkins@company.com"),
          uMap.get("marcus.aurelius@company.com"),
          uMap.get("david.kim@company.com"),
          uMap.get("lily.nguyen@company.com"),
        ],
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },
    ];

    const projects = await ProjectModel.create(projectsData);
    console.log(`✅ Seeded ${projects.length} projects successfully!`);

    // Helper map to quickly find projects by title
    const pMap = new Map(projects.map((p) => [p.title, p._id]));

    // ======= 3. Seed Sprints (17 Sprints) =======
    console.log("🏃 Seeding Sprints...");
    const sprintsData = [
      // Acme E-Commerce Redesign Sprints
      {
        project: pMap.get("Acme E-Commerce Redesign"),
        title: "Sprint 1: Architecture & Designs",
        sprintNumber: 1,
        startDate: new Date(projects[0].startDate),
        endDate: new Date(projects[0].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 1,
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },
      {
        project: pMap.get("Acme E-Commerce Redesign"),
        title: "Sprint 2: Homepage & Catalog API",
        sprintNumber: 2,
        startDate: new Date(projects[0].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[0].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 2,
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },
      {
        project: pMap.get("Acme E-Commerce Redesign"),
        title: "Sprint 3: Checkout, Cart & Auth",
        sprintNumber: 3,
        startDate: new Date(projects[0].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[0].startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        order: 3,
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },

      // Nova Mobile Tracking App Sprints
      {
        project: pMap.get("Nova Mobile Tracking App"),
        title: "Sprint 1: App Setup & BLE Wireframes",
        sprintNumber: 1,
        startDate: new Date(projects[1].startDate),
        endDate: new Date(projects[1].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 1,
        createdBy: uMap.get("michael.chen@company.com"),
      },
      {
        project: pMap.get("Nova Mobile Tracking App"),
        title: "Sprint 2: Device Syncing & Vitals UI",
        sprintNumber: 2,
        startDate: new Date(projects[1].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[1].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        order: 2,
        createdBy: uMap.get("michael.chen@company.com"),
      },
      {
        project: pMap.get("Nova Mobile Tracking App"),
        title: "Sprint 3: Push Notifications & Offline Data",
        sprintNumber: 3,
        startDate: new Date(projects[1].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[1].startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
        status: "PLANNING",
        order: 3,
        createdBy: uMap.get("michael.chen@company.com"),
      },

      // Helix Analytics Dashboard Sprints
      {
        project: pMap.get("Helix Analytics Dashboard"),
        title: "Sprint 1: Server Setup & Aggregator Pipeline",
        sprintNumber: 1,
        startDate: new Date(projects[2].startDate),
        endDate: new Date(projects[2].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 1,
        createdBy: uMap.get("sophia.rodriguez@company.com"),
      },
      {
        project: pMap.get("Helix Analytics Dashboard"),
        title: "Sprint 2: WebSockets Sync & UI Charts",
        sprintNumber: 2,
        startDate: new Date(projects[2].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[2].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 2,
        createdBy: uMap.get("sophia.rodriguez@company.com"),
      },

      // Stellar Cloud Migrator Sprints
      {
        project: pMap.get("Stellar Cloud Migrator"),
        title: "Sprint 1: Database Audits & Schema Mapping",
        sprintNumber: 1,
        startDate: new Date(projects[3].startDate),
        endDate: new Date(projects[3].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 1,
        createdBy: uMap.get("william.harrison@company.com"),
      },
      {
        project: pMap.get("Stellar Cloud Migrator"),
        title: "Sprint 2: Data Transfer Pipeline Setup",
        sprintNumber: 2,
        startDate: new Date(projects[3].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[3].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        order: 2,
        createdBy: uMap.get("william.harrison@company.com"),
      },
      {
        project: pMap.get("Stellar Cloud Migrator"),
        title: "Sprint 3: Network Security & Gateways Config",
        sprintNumber: 3,
        startDate: new Date(projects[3].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[3].startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
        status: "PLANNING",
        order: 3,
        createdBy: uMap.get("william.harrison@company.com"),
      },

      // Quantum Security Audit Sprints
      {
        project: pMap.get("Quantum Security Audit"),
        title: "Sprint 1: Threat Modeling & Static Scans",
        sprintNumber: 1,
        startDate: new Date(projects[4].startDate),
        endDate: new Date(projects[4].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 1,
        createdBy: uMap.get("victoria.regina@company.com"),
      },
      {
        project: pMap.get("Quantum Security Audit"),
        title: "Sprint 2: Dynamic Pentesting & Vulnerability Logs",
        sprintNumber: 2,
        startDate: new Date(projects[4].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[4].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        order: 2,
        createdBy: uMap.get("victoria.regina@company.com"),
      },

      // Zenith CRM Portal Sprints
      {
        project: pMap.get("Zenith CRM Portal"),
        title: "Sprint 1: CRM Pipelines & Custom Fields",
        sprintNumber: 1,
        startDate: new Date(projects[5].startDate),
        endDate: new Date(projects[5].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 1,
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },
      {
        project: pMap.get("Zenith CRM Portal"),
        title: "Sprint 2: Integration Logs & Sales Dashboard Charts",
        sprintNumber: 2,
        startDate: new Date(projects[5].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[5].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 2,
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },
      {
        project: pMap.get("Zenith CRM Portal"),
        title: "Sprint 3: User Accounts & Email Trigger Configs",
        sprintNumber: 3,
        startDate: new Date(projects[5].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        endDate: new Date(projects[5].startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
        status: "COMPLETED",
        order: 3,
        createdBy: uMap.get("sarah.jenkins@company.com"),
      },
    ];

    const sprints = await SprintModel.create(sprintsData);
    console.log(`✅ Seeded ${sprints.length} sprints successfully!`);

    // Helper map to locate sprints by project ID and sprint number
    const sMap = new Map();
    sprints.forEach((s) => {
      sMap.set(`${s.project.toString()}_${s.sprintNumber}`, s._id);
    });

    // ======= 4. Seed Tasks (50 Tasks) =======
    console.log("📝 Seeding 50 Tasks...");

    const tasksToInsert = [];

    // --- Acme E-Commerce Redesign Tasks (8 tasks) ---
    const acmeId = pMap.get("Acme E-Commerce Redesign");
    const acmeSprint1 = sMap.get(`${acmeId}_1`);
    const acmeSprint2 = sMap.get(`${acmeId}_2`);
    const acmeSprint3 = sMap.get(`${acmeId}_3`);

    tasksToInsert.push({
      title: "Create Figma wireframes for Homepage & Checkout",
      description:
        "Design responsive grid system layout for mobile, tablet, and desktop viewports. Establish style guide for typography and primary buttons.",
      project: acmeId,
      sprint: acmeSprint1,
      assignees: [uMap.get("james.carter@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 12,
      dueDate: new Date(projects[0].startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      taskNumber: 1,
      subtasks: [
        { title: "Homepage wireframes", completed: true },
        { title: "Checkout wireframes", completed: true },
      ],
      attachments: [
        {
          url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
          publicId: "mpms/attachments/figma_mockup",
          filename: "figma_ecommerce_mockup.png",
          resourceType: "image",
          uploadedBy: uMap.get("james.carter@company.com"),
          uploadedAt: new Date(projects[0].startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      ],
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Setup Next.js project repository & CI/CD deployment pipeline",
      description:
        "Initialize Next.js 14 project, configure ESLint, Prettier, Husky. Setup GitHub Actions for build checks and automatic deploy to Vercel staging.",
      project: acmeId,
      sprint: acmeSprint1,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 8,
      dueDate: new Date(projects[0].startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      taskNumber: 2,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Implement Headless Shopify API integration layer",
      description:
        "Build Shopify Storefront API client in TypeScript. Setup helper methods for querying products, collections, and creating/updating checkouts.",
      project: acmeId,
      sprint: acmeSprint2,
      assignees: [uMap.get("emma.watson@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 20,
      dueDate: new Date(projects[0].startDate.getTime() + 25 * 24 * 60 * 60 * 1000),
      taskNumber: 3,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Develop responsive Homepage and Navigation components",
      description:
        "Implement main layout, global navbar, category links, hero banner carousel, and product listing grid according to wireframes.",
      project: acmeId,
      sprint: acmeSprint2,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "MEDIUM",
      status: "DONE",
      estimate: 15,
      dueDate: new Date(projects[0].startDate.getTime() + 27 * 24 * 60 * 60 * 1000),
      taskNumber: 4,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Build interactive Checkout flow and shopping cart slide-over",
      description:
        "Create slide-over cart panel using React state. Integrate Shopify cart API. Design multi-step shipping, billing, and credit card entry forms.",
      project: acmeId,
      sprint: acmeSprint3,
      assignees: [uMap.get("david.kim@company.com"), uMap.get("james.carter@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "HIGH",
      status: "IN_PROGRESS",
      estimate: 24,
      dueDate: new Date(projects[0].startDate.getTime() + 38 * 24 * 60 * 60 * 1000),
      taskNumber: 5,
      subtasks: [
        { title: "Cart slide-over UI Layout", completed: true },
        { title: "Shipping details form inputs", completed: false },
        { title: "Billing & Payment Gateway", completed: false },
      ],
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Setup user registration, login, and profile editing endpoints",
      description:
        "Develop server-side authentication endpoints. Integrate JWT cookies and profile management service. Connect frontend profile page.",
      project: acmeId,
      sprint: acmeSprint3,
      assignees: [uMap.get("emma.watson@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "HIGH",
      status: "REVIEW",
      estimate: 16,
      dueDate: new Date(projects[0].startDate.getTime() + 37 * 24 * 60 * 60 * 1000),
      taskNumber: 6,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Optimize page load speed & Core Web Vitals (LCP/INP)",
      description:
        "Audit images, implement Next.js next/image components, setup font caching, reduce bundle sizes and configure fetch priorities.",
      project: acmeId,
      sprint: acmeSprint3,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "MEDIUM",
      status: "TODO",
      estimate: 10,
      dueDate: new Date(projects[0].startDate.getTime() + 41 * 24 * 60 * 60 * 1000),
      taskNumber: 7,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Write end-to-end integration tests for checkout pipeline",
      description:
        "Write Cypress testing suite covering add-to-cart, cart quantity updates, user login, checkout billing form, and payment submission.",
      project: acmeId,
      sprint: acmeSprint3,
      assignees: [uMap.get("liam.oconnor@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "MEDIUM",
      status: "TODO",
      estimate: 12,
      dueDate: new Date(projects[0].startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
      taskNumber: 8,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    // --- Nova Mobile Tracking App Tasks (8 tasks) ---
    const novaId = pMap.get("Nova Mobile Tracking App");
    const novaSprint1 = sMap.get(`${novaId}_1`);
    const novaSprint2 = sMap.get(`${novaId}_2`);
    const novaSprint3 = sMap.get(`${novaId}_3`);

    tasksToInsert.push({
      title: "Initialize React Native Expo project & add configs",
      description:
        "Setup Expo project template. Add typescript support. Configure Tailwindcss styling layer using NativeWind.",
      project: novaId,
      sprint: novaSprint1,
      assignees: [uMap.get("elena.rostova@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 8,
      dueDate: new Date(projects[1].startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
      taskNumber: 1,
      createdBy: uMap.get("michael.chen@company.com"),
    });

    tasksToInsert.push({
      title: "Design BLE pairing flow and vitals chart UI wireframes",
      description:
        "Draft patient onboarding flow. Design user interfaces for Bluetooth device discovery, connection states, and health monitoring.",
      project: novaId,
      sprint: novaSprint1,
      assignees: [uMap.get("lily.nguyen@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "MEDIUM",
      status: "DONE",
      estimate: 14,
      dueDate: new Date(projects[1].startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      taskNumber: 2,
      attachments: [
        {
          url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
          publicId: "mpms/attachments/medical_charts",
          filename: "medical_charts_wireframe.png",
          resourceType: "image",
          uploadedBy: uMap.get("lily.nguyen@company.com"),
          uploadedAt: new Date(projects[1].startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        },
      ],
      createdBy: uMap.get("michael.chen@company.com"),
    });

    tasksToInsert.push({
      title: "Integrate BLE-plx library and discover bluetooth sensors",
      description:
        "Implement Bluetooth permission requesting for iOS and Android. Write bluetooth manager class to scan and connect to BLE vitals sensors.",
      project: novaId,
      sprint: novaSprint2,
      assignees: [uMap.get("elena.rostova@company.com"), uMap.get("alex.rivera@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      estimate: 24,
      dueDate: new Date(projects[1].startDate.getTime() + 24 * 24 * 60 * 60 * 1000),
      taskNumber: 3,
      createdBy: uMap.get("michael.chen@company.com"),
    });

    tasksToInsert.push({
      title: "Implement real-time patient charts using gifted-charts",
      description:
        "Render dynamic bezier charts showing hourly heart rate and oxygen saturation. Support zooming and data point tooltip selection.",
      project: novaId,
      sprint: novaSprint2,
      assignees: [uMap.get("lily.nguyen@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "HIGH",
      status: "IN_PROGRESS",
      estimate: 16,
      dueDate: new Date(projects[1].startDate.getTime() + 26 * 24 * 60 * 60 * 1000),
      taskNumber: 4,
      createdBy: uMap.get("michael.chen@company.com"),
    });

    tasksToInsert.push({
      title: "Create test simulation script for BLE data generator",
      description:
        "Build mock sensor class that generates random but realistic pulse and SpO2 ranges, broadcasting values over virtual characteristic.",
      project: novaId,
      sprint: novaSprint2,
      assignees: [uMap.get("alex.rivera@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "MEDIUM",
      status: "REVIEW",
      estimate: 10,
      dueDate: new Date(projects[1].startDate.getTime() + 20 * 24 * 60 * 60 * 1000),
      taskNumber: 5,
      createdBy: uMap.get("michael.chen@company.com"),
    });

    tasksToInsert.push({
      title: "Validate BLE scan reliability across Android versions",
      description:
        "Audit bluetooth connection handshakes on Android physical devices. Resolve connection dropouts and background scan limits.",
      project: novaId,
      sprint: novaSprint2,
      assignees: [uMap.get("aisha.patel@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "HIGH",
      status: "TODO",
      estimate: 15,
      dueDate: new Date(projects[1].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      taskNumber: 6,
      createdBy: uMap.get("michael.chen@company.com"),
    });

    tasksToInsert.push({
      title: "Setup push notifications via Firebase Cloud Messaging",
      description:
        "Connect Expo push notification server credentials. Implement background handlers to alert doctor user if vitals cross threshold.",
      project: novaId,
      sprint: novaSprint3,
      assignees: [uMap.get("elena.rostova@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "HIGH",
      status: "TODO",
      estimate: 18,
      dueDate: new Date(projects[1].startDate.getTime() + 38 * 24 * 60 * 60 * 1000),
      taskNumber: 7,
      createdBy: uMap.get("michael.chen@company.com"),
    });

    tasksToInsert.push({
      title: "Implement offline storage backup using WatermelonDB",
      description:
        "Setup sqlite-based local offline storage layer. Configure automatic synchronization with central server whenever connection restores.",
      project: novaId,
      sprint: novaSprint3,
      assignees: [uMap.get("alex.rivera@company.com")],
      reporter: uMap.get("michael.chen@company.com"),
      priority: "HIGH",
      status: "TODO",
      estimate: 22,
      dueDate: new Date(projects[1].startDate.getTime() + 41 * 24 * 60 * 60 * 1000),
      taskNumber: 8,
      createdBy: uMap.get("michael.chen@company.com"),
    });

    // --- Helix Analytics Dashboard Tasks (8 tasks) ---
    const helixId = pMap.get("Helix Analytics Dashboard");
    const helixSprint1 = sMap.get(`${helixId}_1`);
    const helixSprint2 = sMap.get(`${helixId}_2`);

    tasksToInsert.push({
      title: "Ingestion pipeline and timeseries schema setup",
      description:
        "Write Express server listeners to aggregate metrics payload from remote microservices. Setup database schemas for fast timeseries inserts.",
      project: helixId,
      sprint: helixSprint1,
      assignees: [uMap.get("emma.watson@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 18,
      dueDate: new Date(projects[2].startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      taskNumber: 1,
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    tasksToInsert.push({
      title: "Design grid layout for Helix platform widgets",
      description:
        "Establish dark-themed layouts including sidebar navigation, custom chart widgets, active user tables, and server alert panels.",
      project: helixId,
      sprint: helixSprint1,
      assignees: [uMap.get("sophia.rodriguez@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 12,
      dueDate: new Date(projects[2].startDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      taskNumber: 2,
      attachments: [
        {
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          publicId: "mpms/attachments/helix_dashboard_mockup",
          filename: "helix_dashboard_layout.png",
          resourceType: "image",
          uploadedBy: uMap.get("sophia.rodriguez@company.com"),
          uploadedAt: new Date(projects[2].startDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        },
      ],
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    tasksToInsert.push({
      title: "Configure Socket.io server live broadcasting feed",
      description:
        "Write WebSocket server wrapper inside Express server. Setup broadcasting triggers inside microservice ingestion pipelines.",
      project: helixId,
      sprint: helixSprint2,
      assignees: [uMap.get("emma.watson@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 16,
      dueDate: new Date(projects[2].startDate.getTime() + 24 * 24 * 60 * 60 * 1000),
      taskNumber: 3,
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    tasksToInsert.push({
      title: "Implement responsive chart widgets with Recharts",
      description:
        "Render metric charts including active request rates, memory allocations, server logs, and user geographies on world map widget.",
      project: helixId,
      sprint: helixSprint2,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 15,
      dueDate: new Date(projects[2].startDate.getTime() + 26 * 24 * 60 * 60 * 1000),
      taskNumber: 4,
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    tasksToInsert.push({
      title: "Load testing and framework performance diagnostics",
      description:
        "Simulate concurrent metrics inputs from 50+ background daemons. Validate WebSocket frame delivery rate and CPU usages.",
      project: helixId,
      sprint: helixSprint2,
      assignees: [uMap.get("aisha.patel@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "MEDIUM",
      status: "DONE",
      estimate: 10,
      dueDate: new Date(projects[2].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      taskNumber: 5,
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    tasksToInsert.push({
      title: "Optimize time-series MongoDB queries for large historical range",
      description:
        "Audit indexing and implement buckets/aggregation cache on historical raw logs to prevent load spikes during query reloads.",
      project: helixId,
      sprint: helixSprint2,
      assignees: [uMap.get("david.kim@company.com"), uMap.get("emma.watson@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 14,
      dueDate: new Date(projects[2].startDate.getTime() + 27 * 24 * 60 * 60 * 1000),
      taskNumber: 6,
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    tasksToInsert.push({
      title: "Conduct security audit on WebSocket connection gates",
      description:
        "Verify JWT access verification triggers during handshakes. Implement rate limiting and connection pooling limits.",
      project: helixId,
      sprint: helixSprint2,
      assignees: [uMap.get("aisha.patel@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 8,
      dueDate: new Date(projects[2].startDate.getTime() + 29 * 24 * 60 * 60 * 1000),
      taskNumber: 7,
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    tasksToInsert.push({
      title: "Build CSV/JSON logs export tools in dashboard interface",
      description:
        "Expose API endpoint and connect UI button to fetch historical timeseries and download formatted CSV report files.",
      project: helixId,
      sprint: helixSprint2,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sophia.rodriguez@company.com"),
      priority: "LOW",
      status: "DONE",
      estimate: 6,
      dueDate: new Date(projects[2].startDate.getTime() + 29 * 24 * 60 * 60 * 1000),
      taskNumber: 8,
      createdBy: uMap.get("sophia.rodriguez@company.com"),
    });

    // --- Stellar Cloud Migrator Tasks (9 tasks) ---
    const stellarId = pMap.get("Stellar Cloud Migrator");
    const stellarSprint1 = sMap.get(`${stellarId}_1`);
    const stellarSprint2 = sMap.get(`${stellarId}_2`);
    const stellarSprint3 = sMap.get(`${stellarId}_3`);

    tasksToInsert.push({
      title: "Audit legacy Oracle database schema and compute instance requirements",
      description:
        "Map tables, relational integrity limits, constraints, and indexes. Estimate AWS target EC2 sizing and compute limits.",
      project: stellarId,
      sprint: stellarSprint1,
      assignees: [uMap.get("nathaniel.foster@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 15,
      dueDate: new Date(projects[3].startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      taskNumber: 1,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Draft AWS landing zone topology and VPC network configuration",
      description:
        "Design multi-region VPCs, public/private subnets, VPN gateways, security groups, and route tables inside cloud architecture sheets.",
      project: stellarId,
      sprint: stellarSprint1,
      assignees: [uMap.get("william.harrison@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 18,
      dueDate: new Date(projects[3].startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
      taskNumber: 2,
      attachments: [
        {
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
          publicId: "mpms/attachments/cloud_architecture",
          filename: "aws_vpc_topology.png",
          resourceType: "image",
          uploadedBy: uMap.get("william.harrison@company.com"),
          uploadedAt: new Date(projects[3].startDate.getTime() + 8 * 24 * 60 * 60 * 1000),
        },
      ],
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Setup AWS Snowball device order and mapping directory metadata",
      description:
        "Trigger snowball import request in AWS console. Prepare localized NAS volumes, folders, and access keys for secure payload copy.",
      project: stellarId,
      sprint: stellarSprint1,
      assignees: [uMap.get("grace.hopper@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "MEDIUM",
      status: "DONE",
      estimate: 10,
      dueDate: new Date(projects[3].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      taskNumber: 3,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Deploy AWS DMS replication tasks for database migration",
      description:
        "Configure AWS Database Migration Service tasks. Verify source Oracle endpoint and target Aurora PostgreSQL endpoint connections.",
      project: stellarId,
      sprint: stellarSprint2,
      assignees: [uMap.get("nathaniel.foster@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      estimate: 25,
      dueDate: new Date(projects[3].startDate.getTime() + 25 * 24 * 60 * 60 * 1000),
      taskNumber: 4,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Implement Terraform scripts for cloud infrastructure state",
      description:
        "Write declarative IaC configuration files covering VPC resources, security rules, auto-scaling arrays, and RDS postgres clusters.",
      project: stellarId,
      sprint: stellarSprint2,
      assignees: [
        uMap.get("william.harrison@company.com"),
        uMap.get("nathaniel.foster@company.com"),
      ],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "HIGH",
      status: "IN_PROGRESS",
      estimate: 20,
      dueDate: new Date(projects[3].startDate.getTime() + 27 * 24 * 60 * 60 * 1000),
      taskNumber: 5,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Write migration synchronization validation scripts",
      description:
        "Build custom Go test scripts to verify target PostgreSQL count records, row-hashes, and schema constraints match original Oracle data.",
      project: stellarId,
      sprint: stellarSprint2,
      assignees: [uMap.get("grace.hopper@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "MEDIUM",
      status: "REVIEW",
      estimate: 14,
      dueDate: new Date(projects[3].startDate.getTime() + 24 * 24 * 60 * 60 * 1000),
      taskNumber: 6,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Verify backup storage security rules and bucket encryption gates",
      description:
        "Perform compliance testing. Enforce KMS keys on target S3 buckets, block public policies, and setup lifecycle transition triggers.",
      project: stellarId,
      sprint: stellarSprint2,
      assignees: [uMap.get("clara.barton@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "HIGH",
      status: "TODO",
      estimate: 12,
      dueDate: new Date(projects[3].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      taskNumber: 7,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Configure target AWS IAM roles, groups, and access directories",
      description:
        "Define policies for developers, testers, read-only managers, and operations personnel. Secure credential limits with MFA constraints.",
      project: stellarId,
      sprint: stellarSprint3,
      assignees: [uMap.get("grace.hopper@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "HIGH",
      status: "TODO",
      estimate: 15,
      dueDate: new Date(projects[3].startDate.getTime() + 38 * 24 * 60 * 60 * 1000),
      taskNumber: 8,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    tasksToInsert.push({
      title: "Establish live system monitoring alerts via CloudWatch",
      description:
        "Configure custom alert hooks targeting CPU usage limits, latency spikes on database instances, and network ingress thresholds.",
      project: stellarId,
      sprint: stellarSprint3,
      assignees: [uMap.get("clara.barton@company.com")],
      reporter: uMap.get("william.harrison@company.com"),
      priority: "MEDIUM",
      status: "TODO",
      estimate: 12,
      dueDate: new Date(projects[3].startDate.getTime() + 41 * 24 * 60 * 60 * 1000),
      taskNumber: 9,
      createdBy: uMap.get("william.harrison@company.com"),
    });

    // --- Quantum Security Audit Tasks (9 tasks) ---
    const quantumId = pMap.get("Quantum Security Audit");
    const quantumSprint1 = sMap.get(`${quantumId}_1`);
    const quantumSprint2 = sMap.get(`${quantumId}_2`);

    tasksToInsert.push({
      title: "Conduct threat modeling session and define network entry surfaces",
      description:
        "Analyze architecture diagrams. Build list of potential access vectors, database interfaces, API routes, and network entry points.",
      project: quantumId,
      sprint: quantumSprint1,
      assignees: [uMap.get("victoria.regina@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 10,
      dueDate: new Date(projects[4].startDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      taskNumber: 1,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Execute static application security testing (SAST) audits",
      description:
        "Configure code analysis scripts to scan repositories. Identify outdated library references, hardcoded credentials, and SQL injection flaws.",
      project: quantumId,
      sprint: quantumSprint1,
      assignees: [uMap.get("arthur.pendragon@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 16,
      dueDate: new Date(projects[4].startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
      taskNumber: 2,
      attachments: [
        {
          url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
          publicId: "mpms/attachments/security_threat_model",
          filename: "security_vulnerability_log.png",
          resourceType: "image",
          uploadedBy: uMap.get("arthur.pendragon@company.com"),
          uploadedAt: new Date(projects[4].startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        },
      ],
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Run OWASP dependency vulnerability check reports",
      description:
        "Generate static list of all nested project library dependencies. Flag CVSS scores above 7.0 for mandatory immediate library upgrades.",
      project: quantumId,
      sprint: quantumSprint1,
      assignees: [uMap.get("liam.oconnor@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 8,
      dueDate: new Date(projects[4].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      taskNumber: 3,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Simulate external API penetration attempts and injection scans",
      description:
        "Deploy burp suite and custom scripting suites to test login endpoint gates, authentication headers, and database payloads.",
      project: quantumId,
      sprint: quantumSprint2,
      assignees: [uMap.get("arthur.pendragon@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      estimate: 24,
      dueDate: new Date(projects[4].startDate.getTime() + 24 * 24 * 60 * 60 * 1000),
      taskNumber: 4,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Validate credential storage encryption rules on active DBs",
      description:
        "Verify bcrypt work factors, check encryption-at-rest keys on databases, and audit JWT secret string key length compliance.",
      project: quantumId,
      sprint: quantumSprint2,
      assignees: [uMap.get("victoria.regina@company.com"), uMap.get("liam.oconnor@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "HIGH",
      status: "IN_PROGRESS",
      estimate: 14,
      dueDate: new Date(projects[4].startDate.getTime() + 26 * 24 * 60 * 60 * 1000),
      taskNumber: 5,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Conduct vulnerability triage meetings with engineering leads",
      description:
        "Compile vulnerabilities found in Sprint 1. Coordinate priority mitigation tickets and schedule developer timelines.",
      project: quantumId,
      sprint: quantumSprint2,
      assignees: [uMap.get("aisha.patel@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "MEDIUM",
      status: "REVIEW",
      estimate: 10,
      dueDate: new Date(projects[4].startDate.getTime() + 22 * 24 * 60 * 60 * 1000),
      taskNumber: 6,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Write final security compliance report document",
      description:
        "Format detailed findings summary including remediation actions, compliance logs, and risk matrix graphs for client presentation.",
      project: quantumId,
      sprint: quantumSprint2,
      assignees: [uMap.get("victoria.regina@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "HIGH",
      status: "TODO",
      estimate: 15,
      dueDate: new Date(projects[4].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      taskNumber: 7,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Audit admin console user logs and role permission limits",
      description:
        "Verify that managers and developers do not have access to production environment keys and root billing profiles.",
      project: quantumId,
      sprint: quantumSprint2,
      assignees: [uMap.get("aisha.patel@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "HIGH",
      status: "TODO",
      estimate: 12,
      dueDate: new Date(projects[4].startDate.getTime() + 27 * 24 * 60 * 60 * 1000),
      taskNumber: 8,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    tasksToInsert.push({
      title: "Validate cloud storage public policy blocks and access keys",
      description:
        "Scan active cloud resources for public read/write permission settings. Enforce strict authorization headers.",
      project: quantumId,
      sprint: quantumSprint2,
      assignees: [uMap.get("liam.oconnor@company.com")],
      reporter: uMap.get("victoria.regina@company.com"),
      priority: "MEDIUM",
      status: "TODO",
      estimate: 8,
      dueDate: new Date(projects[4].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      taskNumber: 9,
      createdBy: uMap.get("victoria.regina@company.com"),
    });

    // --- Zenith CRM Portal Tasks (9 tasks) ---
    const zenithId = pMap.get("Zenith CRM Portal");
    const zenithSprint1 = sMap.get(`${zenithId}_1`);
    const zenithSprint2 = sMap.get(`${zenithId}_2`);
    const zenithSprint3 = sMap.get(`${zenithId}_3`);

    tasksToInsert.push({
      title: "Establish CRM lead tracking fields and database schemas",
      description:
        "Design relational layouts representing leads, transactions, activities, sales cycles, and assignees.",
      project: zenithId,
      sprint: zenithSprint1,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 15,
      dueDate: new Date(projects[5].startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      taskNumber: 1,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Create interactive user onboarding flow wireframes",
      description:
        "Design Figma layouts representing lead profile pages, dashboard metrics charts, and pipeline stage drag-and-drop lists.",
      project: zenithId,
      sprint: zenithSprint1,
      assignees: [uMap.get("lily.nguyen@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 10,
      dueDate: new Date(projects[5].startDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      taskNumber: 2,
      attachments: [
        {
          url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
          publicId: "mpms/attachments/zenith_wireframes",
          filename: "zenith_crm_onboarding.png",
          resourceType: "image",
          uploadedBy: uMap.get("lily.nguyen@company.com"),
          uploadedAt: new Date(projects[5].startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        },
      ],
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Build pipeline stage cards and dashboard summary charts",
      description:
        "Implement interactive drag-and-drop kanban boards to track lead stages. Bind cards to database triggers to update status instantly.",
      project: zenithId,
      sprint: zenithSprint2,
      assignees: [uMap.get("david.kim@company.com"), uMap.get("marcus.aurelius@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 20,
      dueDate: new Date(projects[5].startDate.getTime() + 24 * 24 * 60 * 60 * 1000),
      taskNumber: 3,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Create system integration endpoints for third-party syncs",
      description:
        "Develop webhook interfaces and request handlers to synchronize user actions with active marketing campaign systems.",
      project: zenithId,
      sprint: zenithSprint2,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "MEDIUM",
      status: "DONE",
      estimate: 12,
      dueDate: new Date(projects[5].startDate.getTime() + 26 * 24 * 60 * 60 * 1000),
      taskNumber: 4,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Integrate email triggers via Nodemailer and SES",
      description:
        "Write email generation scripts. Configure SMTP settings, create responsive message templates, and hook up auto-response triggers.",
      project: zenithId,
      sprint: zenithSprint2,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 16,
      dueDate: new Date(projects[5].startDate.getTime() + 27 * 24 * 60 * 60 * 1000),
      taskNumber: 5,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Build user account profile management pages in frontend",
      description:
        "Develop user profiles UI where managers can assign team roles, departments, update profile images, and edit user status.",
      project: zenithId,
      sprint: zenithSprint3,
      assignees: [uMap.get("marcus.aurelius@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "HIGH",
      status: "DONE",
      estimate: 14,
      dueDate: new Date(projects[5].startDate.getTime() + 38 * 24 * 60 * 60 * 1000),
      taskNumber: 6,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Perform functional regression testing on user profile forms",
      description:
        "Verify form input validations, confirm success states, and test errors on email structure in user profile editor screens.",
      project: zenithId,
      sprint: zenithSprint3,
      assignees: [uMap.get("lily.nguyen@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "MEDIUM",
      status: "DONE",
      estimate: 8,
      dueDate: new Date(projects[5].startDate.getTime() + 39 * 24 * 60 * 60 * 1000),
      taskNumber: 7,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Write documentation on lead assignment settings and stages",
      description:
        "Compile markdown files detailing CRM configuration, webhook endpoints, data schemas, and user account status values.",
      project: zenithId,
      sprint: zenithSprint3,
      assignees: [uMap.get("marcus.aurelius@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "LOW",
      status: "DONE",
      estimate: 6,
      dueDate: new Date(projects[5].startDate.getTime() + 40 * 24 * 60 * 60 * 1000),
      taskNumber: 8,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    tasksToInsert.push({
      title: "Deploy Zenith CRM platform to production environment",
      description:
        "Run build compilation checks, setup environment configurations, deploy codebase, and verify database connections.",
      project: zenithId,
      sprint: zenithSprint3,
      assignees: [uMap.get("david.kim@company.com")],
      reporter: uMap.get("sarah.jenkins@company.com"),
      priority: "CRITICAL",
      status: "DONE",
      estimate: 10,
      dueDate: new Date(projects[5].startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
      taskNumber: 9,
      createdBy: uMap.get("sarah.jenkins@company.com"),
    });

    const tasks = await TaskModel.create(tasksToInsert);
    console.log(`✅ Seeded ${tasks.length} tasks successfully!`);

    // Helper map to locate tasks by project ID and taskNumber
    const tMap = new Map();
    tasks.forEach((t) => {
      tMap.set(`${t.project.toString()}_${t.taskNumber}`, t._id);
    });

    // ======= 5. Seed Comments (18 Comments) =======
    console.log("💬 Seeding Comments...");
    const commentsData = [
      // Acme E-Commerce Redesign Comments
      {
        task: tMap.get(`${acmeId}_5`), // Checkout flow
        author: uMap.get("james.carter@company.com"),
        body: "I've uploaded the mockups for the checkout slide-over cart. Let me know if the spacing looks correct on mobile viewports.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[0].startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_5`),
        author: uMap.get("david.kim@company.com"),
        body: "The mockups look fantastic, James! I'm starting on the cart slide-over layout today. Emma, do we have the Shopify API checkout endpoints ready for testing?",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[0].startDate.getTime() + 31 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_5`),
        author: uMap.get("emma.watson@company.com"),
        body: "Yes, David! The Shopify client is fully integrated. You can use the `createShopifyCheckout` and `updateShopifyCart` functions inside the analytics layer.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[0].startDate.getTime() + 31 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_6`), // Auth
        author: uMap.get("emma.watson@company.com"),
        body: "The auth endpoints are fully complete and unit tests are passing. Requesting review on this before I merge it to dev.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[0].startDate.getTime() + 34 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_6`),
        author: uMap.get("sarah.jenkins@company.com"),
        body: "Great progress Emma. I'll test the cookie flow on staging this afternoon and approve.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[0].startDate.getTime() + 35 * 24 * 60 * 60 * 1000),
      },

      // Nova Mobile Tracking App Comments
      {
        task: tMap.get(`${novaId}_3`), // BLE sensor
        author: uMap.get("elena.rostova@company.com"),
        body: "I've run into scanning delays on Android 13 devices. It seems we need to explicitly request `BLUETOOTH_SCAN` runtime permission. I am fixing it today.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[1].startDate.getTime() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${novaId}_3`),
        author: uMap.get("michael.chen@company.com"),
        body: "Good catch, Elena. Yes, Android 12+ requires runtime permission requests. Let's make sure our simulator test generator handles virtual devices correctly as well.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[1].startDate.getTime() + 19 * 24 * 60 * 60 * 1000),
      },

      // Stellar Cloud Migrator Comments
      {
        task: tMap.get(`${stellarId}_4`), // DMS task
        author: uMap.get("nathaniel.foster@company.com"),
        body: "We need to scale the source Oracle listener instance. We encountered packet timeouts during testing of the initial mock sync task.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[3].startDate.getTime() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${stellarId}_4`),
        author: uMap.get("william.harrison@company.com"),
        body: "Understood Nathaniel. I am increasing the bandwidth limit on the VPC gateway today. Please monitor CPU allocations on the replication instance.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[3].startDate.getTime() + 19 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${stellarId}_6`), // sync scripts
        author: uMap.get("grace.hopper@company.com"),
        body: "The verification script is complete. Running it against staging outputs zero mismatches! We are ready for live migration.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[3].startDate.getTime() + 23 * 24 * 60 * 60 * 1000),
      },

      // Quantum Security Audit Comments
      {
        task: tMap.get(`${quantumId}_4`), // Pentest
        author: uMap.get("arthur.pendragon@company.com"),
        body: "I've flagged two security endpoints displaying missing cross-site request validation headers. I am documenting details inside target logs now.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[4].startDate.getTime() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${quantumId}_4`),
        author: uMap.get("victoria.regina@company.com"),
        body: "Excellent, Arthur. Please include the raw response payloads in the vulnerability sheet so engineering can verify the endpoints.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[4].startDate.getTime() + 19 * 24 * 60 * 60 * 1000),
      },

      // Zenith CRM Comments
      {
        task: tMap.get(`${zenithId}_3`), // pipelines
        author: uMap.get("david.kim@company.com"),
        body: "The Drag-and-drop boards are complete. Marcus, could you check if card margins align correctly in different resolutions?",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[5].startDate.getTime() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${zenithId}_3`),
        author: uMap.get("marcus.aurelius@company.com"),
        body: "Sure thing, David. The layout alignment looks clean on desktop viewports. I'll make minor updates to responsive styles for tablet sizes.",
        parentComment: null,
        isEdited: false,
        createdAt: new Date(projects[5].startDate.getTime() + 19 * 24 * 60 * 60 * 1000),
      },
    ];

    const comments = await CommentModel.create(commentsData);
    console.log(`✅ Seeded ${comments.length} comments successfully!`);

    // ======= 6. Seed Time Logs (28 Time Logs) =======
    console.log("⏱️ Seeding Time Logs...");
    const timeLogsData = [
      // Acme E-Commerce Redesign Task 1
      {
        task: tMap.get(`${acmeId}_1`),
        user: uMap.get("james.carter@company.com"),
        hours: 6.5,
        description: "Initial wireframes and homepage layouts in Figma",
        loggedDate: new Date(projects[0].startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_1`),
        user: uMap.get("james.carter@company.com"),
        hours: 5.5,
        description: "Finalizing checkout wireframes and typography guidelines",
        loggedDate: new Date(projects[0].startDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      },

      // Acme E-Commerce Redesign Task 2
      {
        task: tMap.get(`${acmeId}_2`),
        user: uMap.get("david.kim@company.com"),
        hours: 4.0,
        description:
          "Configured Next.js project repo structure, linting rules, and pre-commit hooks",
        loggedDate: new Date(projects[0].startDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_2`),
        user: uMap.get("david.kim@company.com"),
        hours: 4.0,
        description: "Setup GitHub Actions workflow and verified automatic deployment on Vercel",
        loggedDate: new Date(projects[0].startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      },

      // Acme E-Commerce Redesign Task 3
      {
        task: tMap.get(`${acmeId}_3`),
        user: uMap.get("emma.watson@company.com"),
        hours: 8.0,
        description: "Created client module to communicate with Shopify Storefront API",
        loggedDate: new Date(projects[0].startDate.getTime() + 16 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_3`),
        user: uMap.get("emma.watson@company.com"),
        hours: 6.5,
        description: "Implemented checkout methods and cart query operations",
        loggedDate: new Date(projects[0].startDate.getTime() + 19 * 24 * 60 * 60 * 1000),
      },

      // Acme E-Commerce Redesign Task 5
      {
        task: tMap.get(`${acmeId}_5`),
        user: uMap.get("david.kim@company.com"),
        hours: 6.0,
        description: "Coded cart slide-over panel with local state management",
        loggedDate: new Date(projects[0].startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_5`),
        user: uMap.get("james.carter@company.com"),
        hours: 3.5,
        description: "Adjusted styling details and animations on mobile layouts",
        loggedDate: new Date(projects[0].startDate.getTime() + 31 * 24 * 60 * 60 * 1000),
      },

      // Nova Mobile Tracking Task 1
      {
        task: tMap.get(`${novaId}_1`),
        user: uMap.get("elena.rostova@company.com"),
        hours: 8.0,
        description:
          "Expo project setup, library installs, package resolution audits, and NativeWind styling layer configuration",
        loggedDate: new Date(projects[1].startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      },

      // Nova Mobile Tracking Task 2
      {
        task: tMap.get(`${novaId}_2`),
        user: uMap.get("lily.nguyen@company.com"),
        hours: 7.0,
        description: "Created wireframes for vitals pairing dashboard",
        loggedDate: new Date(projects[1].startDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      },

      // Stellar Cloud Migrator Task 1
      {
        task: tMap.get(`${stellarId}_1`),
        user: uMap.get("nathaniel.foster@company.com"),
        hours: 8.0,
        description:
          "Auditing legacy database schemas, mapping fields, and identifying indexing details",
        loggedDate: new Date(projects[3].startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${stellarId}_1`),
        user: uMap.get("nathaniel.foster@company.com"),
        hours: 7.0,
        description: "Finalized compute sizing estimates and instance specifications",
        loggedDate: new Date(projects[3].startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      },

      // Stellar Cloud Migrator Task 2
      {
        task: tMap.get(`${stellarId}_2`),
        user: uMap.get("william.harrison@company.com"),
        hours: 9.0,
        description: "Designed multi-region VPC networking arrays, subnets, and routing maps",
        loggedDate: new Date(projects[3].startDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      },

      // Quantum Security Audit Task 1
      {
        task: tMap.get(`${quantumId}_1`),
        user: uMap.get("victoria.regina@company.com"),
        hours: 6.0,
        description: "Conducted threat modeling sessions and mapped vulnerability surfaces",
        loggedDate: new Date(projects[4].startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      },

      // Quantum Security Audit Task 2
      {
        task: tMap.get(`${quantumId}_2`),
        user: uMap.get("arthur.pendragon@company.com"),
        hours: 8.0,
        description: "Configured static code analysis scanners and audited findings logs",
        loggedDate: new Date(projects[4].startDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${quantumId}_2`),
        user: uMap.get("arthur.pendragon@company.com"),
        hours: 6.5,
        description:
          "Filtered scanner results to resolve credential leaks and flag outdated packages",
        loggedDate: new Date(projects[4].startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      },

      // Zenith CRM Task 1
      {
        task: tMap.get(`${zenithId}_1`),
        user: uMap.get("david.kim@company.com"),
        hours: 8.0,
        description: "Designed lead tracking database collections and indices",
        loggedDate: new Date(projects[5].startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      },

      // Zenith CRM Task 3
      {
        task: tMap.get(`${zenithId}_3`),
        user: uMap.get("david.kim@company.com"),
        hours: 8.5,
        description: "Implemented drag-and-drop pipelines on dashboard",
        loggedDate: new Date(projects[5].startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${zenithId}_3`),
        user: uMap.get("marcus.aurelius@company.com"),
        hours: 6.0,
        description: "Polished styling details and animations on cards layout",
        loggedDate: new Date(projects[5].startDate.getTime() + 16 * 24 * 60 * 60 * 1000),
      },
    ];

    const timeLogs = await TimeLogModel.create(timeLogsData);
    console.log(`✅ Seeded ${timeLogs.length} time logs successfully!`);

    // ======= 7. Seed Activity Logs (18 Activity Logs) =======
    console.log("⚡ Seeding Activity Logs...");
    const activityLogsData = [
      // Acme Task 1 activities
      {
        task: tMap.get(`${acmeId}_1`),
        user: uMap.get("sarah.jenkins@company.com"),
        action: "CREATED",
        detail: "Task created by Sarah Jenkins",
        createdAt: new Date(projects[0].startDate.getTime()),
      },
      {
        task: tMap.get(`${acmeId}_1`),
        user: uMap.get("james.carter@company.com"),
        action: "STATUS_CHANGED",
        detail: "Status updated from TODO to IN_PROGRESS",
        createdAt: new Date(projects[0].startDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_1`),
        user: uMap.get("james.carter@company.com"),
        action: "ATTACHMENT_ADDED",
        detail: "Figma mockup attachment uploaded",
        createdAt: new Date(projects[0].startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_1`),
        user: uMap.get("sarah.jenkins@company.com"),
        action: "APPROVED",
        detail: "Task approved and completed",
        createdAt: new Date(projects[0].startDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_1`),
        user: uMap.get("james.carter@company.com"),
        action: "STATUS_CHANGED",
        detail: "Status updated from REVIEW to DONE",
        createdAt: new Date(projects[0].startDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      },

      // Acme Task 5 activities
      {
        task: tMap.get(`${acmeId}_5`),
        user: uMap.get("sarah.jenkins@company.com"),
        action: "CREATED",
        detail: "Task created by Sarah Jenkins",
        createdAt: new Date(projects[0].startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${acmeId}_5`),
        user: uMap.get("david.kim@company.com"),
        action: "STATUS_CHANGED",
        detail: "Status updated from TODO to IN_PROGRESS",
        createdAt: new Date(projects[0].startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },

      // Stellar Migrator Task 4 activities
      {
        task: tMap.get(`${stellarId}_4`),
        user: uMap.get("william.harrison@company.com"),
        action: "CREATED",
        detail: "Task created by William Harrison",
        createdAt: new Date(projects[3].startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${stellarId}_4`),
        user: uMap.get("nathaniel.foster@company.com"),
        action: "STATUS_CHANGED",
        detail: "Status updated from TODO to IN_PROGRESS",
        createdAt: new Date(projects[3].startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        task: tMap.get(`${stellarId}_4`),
        user: uMap.get("nathaniel.foster@company.com"),
        action: "COMMENT_ADDED",
        detail: "Added comment regarding database replication network timeout issues",
        createdAt: new Date(projects[3].startDate.getTime() + 18 * 24 * 60 * 60 * 1000),
      },
    ];

    const activityLogs = await ActivityLogModel.create(activityLogsData);
    console.log(`✅ Seeded ${activityLogs.length} activity logs successfully!`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    // ======= Graceful Shutdown =======
    await mongoose.disconnect();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  }
};

seedDatabase();
