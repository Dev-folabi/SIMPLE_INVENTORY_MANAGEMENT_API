import { Role } from "@prisma/client";
import prisma from "../src/prisma";
import bcrypt from "bcrypt";
import logger from "../src/utils/logger.util";

async function main() {
  logger.info("Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("password", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@inventory.test" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@inventory.test",
      password: adminPassword,
      role: Role.admin,
    },
  });
  logger.info("Created admin user:", admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash("password", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@inventory.test" },
    update: {},
    create: {
      name: "Regular User",
      email: "user@inventory.test",
      password: userPassword,
      role: Role.user,
    },
  });
  logger.info("Created regular user:", user.email);

  // Create categories
  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Furniture", slug: "furniture" },
    { name: "Clothing", slug: "clothing" },
    { name: "Food & Beverages", slug: "food-beverages" },
    { name: "Books", slug: "books" },
    { name: "Sports Equipment", slug: "sports-equipment" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  logger.info("Created 6 categories");

  // Get category IDs
  const electronics = await prisma.category.findUnique({
    where: { slug: "electronics" },
  });
  const furniture = await prisma.category.findUnique({
    where: { slug: "furniture" },
  });
  const clothing = await prisma.category.findUnique({
    where: { slug: "clothing" },
  });
  const food = await prisma.category.findUnique({
    where: { slug: "food-beverages" },
  });
  const books = await prisma.category.findUnique({
    where: { slug: "books" },
  });
  const sports = await prisma.category.findUnique({
    where: { slug: "sports-equipment" },
  });

  // Create products
  const products = [
    {
      name: "Laptop",
      description: "High-performance gaming laptop with RTX 4070",
      quantity: 15,
      price: 1999.99,
      categoryId: electronics!.id,
    },
    {
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision tracking",
      quantity: 50,
      price: 29.99,
      categoryId: electronics!.id,
    },
    {
      name: "Office Desk",
      description: "Adjustable standing desk with electric motor",
      quantity: 10,
      price: 499.99,
      categoryId: furniture!.id,
    },
    {
      name: "Ergonomic Chair",
      description: "Premium office chair with lumbar support",
      quantity: 20,
      price: 349.99,
      categoryId: furniture!.id,
    },
    {
      name: "T-Shirt",
      description: "Cotton t-shirt in various colors",
      quantity: 100,
      price: 19.99,
      categoryId: clothing!.id,
    },
    {
      name: "Jeans",
      description: "Classic blue denim jeans",
      quantity: 75,
      price: 59.99,
      categoryId: clothing!.id,
    },
    {
      name: "Coffee Beans",
      description: "Premium arabica coffee beans",
      quantity: 200,
      price: 14.99,
      categoryId: food!.id,
    },
    {
      name: "Green Tea",
      description: "Organic green tea leaves",
      quantity: 150,
      price: 9.99,
      categoryId: food!.id,
    },
    {
      name: "Programming Book",
      description: "Clean Code by Robert C. Martin",
      quantity: 30,
      price: 39.99,
      categoryId: books!.id,
    },
    {
      name: "Novel",
      description: "Bestselling fiction novel",
      quantity: 45,
      price: 24.99,
      categoryId: books!.id,
    },
    {
      name: "Tennis Racket",
      description: "Professional tennis racket",
      quantity: 25,
      price: 129.99,
      categoryId: sports!.id,
    },
    {
      name: "Yoga Mat",
      description: "Non-slip yoga mat with carrying strap",
      quantity: 60,
      price: 34.99,
      categoryId: sports!.id,
    },
    {
      name: "Basketball",
      description: "Official size basketball",
      quantity: 40,
      price: 29.99,
      categoryId: sports!.id,
    },
    {
      name: "Running Shoes",
      description: "Lightweight running shoes",
      quantity: 55,
      price: 89.99,
      categoryId: sports!.id,
    },
    {
      name: "Headphones",
      description: "Noise-cancelling wireless headphones",
      quantity: 35,
      price: 199.99,
      categoryId: electronics!.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  logger.info("Created 15 products");

  logger.info("Database seeding completed!");
}

main()
  .catch((e) => {
    logger.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
