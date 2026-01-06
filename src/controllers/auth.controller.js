import bcrypt from "bcrypt";
import { prisma } from "../lib/prismaClient.js";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  BadRequestError,
} from "../lib/errors.js";
import { RegisterBody, LoginBody } from "../validate/auth.js";
import { generateTokens } from "../lib/token.js";
import { setTokenCookies, clearTokenCookies } from "../lib/cookies.js";

export async function testregister(req, res) {
  try {
    console.log("1. 요청 바디 확인:", req.body);
    const { email, nickname, password } = RegisterBody.parse(req.body);

    console.log("2. DB 조회 시작");
    const isEmailExist = await prisma.user.findUnique({ where: { email } });

    console.log("3. 비밀번호 해싱 시작");
    const hashedPassword = await bcrypt.hash(password, 10);

    // ... 나머지 코드
  } catch (error) {
    console.error("!!! 여기서 에러 발생 !!!", error); // 에러의 정체를 터미널에 출력
    throw error;
  }
}
export async function register(req, res) {
  const { email, nickname, password } = RegisterBody.parse(req.body);
  const isEmailExist = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (isEmailExist) throw new BadRequestError("이미 사용 중인 이메일입니다.");
  const isNicknameExist = await prisma.user.findUnique({
    where: { nickname },
    select: { id: true },
  });
  if (isNicknameExist)
    throw new BadRequestError("이미 사용 중인 닉네임입니다.");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });
  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
}

export async function login(req, res) {
  const { email, password } = LoginBody.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new BadRequestError("아이디 비밀번호 틀렸습니다");
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).send({ message: "로그인 성공" });
}

export async function logout(res) {
  clearTokenCookies(res);
  res.status(200).json({ message: "로그아웃 성공" });
}
