import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    // TODO: Add DTO validation
    return this.authService.register(registerDto.name, registerDto.email, registerDto.password);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    // TODO: Add DTO validation
    return this.authService.login(loginDto.email, loginDto.password);
  }
}