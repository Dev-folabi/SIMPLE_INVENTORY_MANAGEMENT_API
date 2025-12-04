import prisma from "../../prisma";
import { slugify } from "../../utils/slugify.util";

export const createCategory = async (name: string) => {
  const slug = slugify(name);

  // Check if category with same name or slug exists
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  });

  if (existing) {
    throw new Error("Category with this name already exists");
  }

  return await prisma.category.create({
    data: { name, slug },
  });
};

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};
