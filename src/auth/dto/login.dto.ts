import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class logindto{

    @IsNotEmpty()
    @IsEmail({},{message:'please enter valid email'})
    readonly email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string

}