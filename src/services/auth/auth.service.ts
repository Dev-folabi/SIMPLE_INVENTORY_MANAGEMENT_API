import prisma from "../../prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.util";
import { Role } from "@prisma/client";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export const loginUser = async (data: LoginData) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user without password
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const registerUser = async (data: RegisterData) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: (data.role as Role) || Role.user,
    },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user without password
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};
