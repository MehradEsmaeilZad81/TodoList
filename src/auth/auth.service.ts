import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(name: string, email: string, password: string) {
    // TODO: Hash password, create user, return token
  }

  async login(email: string, password: string) {
    // TODO: Validate credentials, return token
  }
}