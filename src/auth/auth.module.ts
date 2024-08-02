import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/db/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtMiddleware } from './jwt.middleware';

@Module({
    imports:[
        PassportModule.register({defaultStrategy:'jwt'}),
        JwtModule.registerAsync({
            inject:[ConfigService],
            useFactory: async (config:ConfigService)=>{
                return {
                    secret:config.get<string>('JWT_SECRET'),
                    signOptions:{
                        expiresIn:config.get<string | number>('JWT_EXPIRES')
                    }
                }
            }
        }),
        MongooseModule.forFeature([{name: User.name , schema: UserSchema}])
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(JwtMiddleware).forRoutes('auth/check');
    }
  }
