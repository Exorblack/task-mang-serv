import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { regdto } from './dto/reg.dto';
import { logindto } from './dto/login.dto';
import { Response,Request } from 'express';

@Controller('auth')
export class AuthController {
  jwtService: any;
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() regDto: regdto, @Res() res: Response) {
    return this.authService.register(regDto, res);
  }

  @Post('login')
  async login(@Body() loginDto: logindto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('check')
  async getProtected(@Req() req: Request) {
    const user = req.user;
    return { message: 'You are authorized', user };
  }

  @Get("getToken")
  async getToken(@Req() req:Request, @Res() res:Response){
      const token = req.cookies.token;
      if (!token) {
        throw new UnauthorizedException('No token found');
      }
      return res.json({"token":token})
  }
}
