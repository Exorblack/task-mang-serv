import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/schemas/user.schema';
import { regdto } from './dto/reg.dto';
import { logindto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(regDto: regdto,@Res() res: Response): Promise<{ token: string }> {
    const { name, email, password } = regDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const emaildup = await this.userModel.findOne({email})
    
    if (emaildup) {
        throw new UnauthorizedException("dup email")
    }

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });
    res.cookie('token', token, { httpOnly: true });
    res.send({ message: 'register successful' });

    return { token }
  }

  async login(loginDto:logindto,@Res() res: Response):Promise<{ token: string }>{
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({email})
    if (!user) {
        throw new UnauthorizedException("invalid email or password")
    }

    const passwordmatch = await bcrypt.compare(password , user.password)
    if (!passwordmatch) {
        throw new UnauthorizedException("invalid email or password")
    }

    const token = this.jwtService.sign({ id: user._id });

    res.cookie('token', token, { httpOnly: true });
    res.send({ message: 'login successful' });

    return { token };

  }

  async logout(@Res() res: Response) {
    res.clearCookie('token');
    res.send({ message: 'Logout successful' });
  }
  
}
