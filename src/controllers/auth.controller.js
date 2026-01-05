import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma, prismaClient } from "../lib/prismaClient.js";
import BadRequestError from "../lib/error/errors.js";
import ConflictError from "../lib/error/conflict.error.js";
import { LoginBody } from "../structs/auth.js";        

export async function register(req, res) {
  const { email, nickname, password } = req.body;
  if (!email || !nickname || !password) {
    throw new BadRequestError("email, nickname, password are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    throw new ConflictError("Email already exists");
  }
}

export async function login (req, res) {
    consr email, password;
  try {
    ({ email, password } = LoginSchema.parse(req.body));
  } catch (e) {
    if (e instanceof ZodError) {
      // 프로젝트 정책대로 메시지 통일
      throw new BadRequestError("email, password are required");
    }
    throw e;
  }

  // 2) 유저 조회
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError("Invalid credentials");

  // 3) 비밀번호 비교
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new UnauthorizedError("Invalid credentials");

  // 4) Access Token 발급
  const accessToken = jwt.sign(
    { userId: user.id }, // Int
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "1h" }
  );

  // 5) password 제거 후 응답
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    accessToken,
    user: userWithoutPassword,
  });
}
