import prisma from "../prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async createCategory(name: string) {
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
  }
}
