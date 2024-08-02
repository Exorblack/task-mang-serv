import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class regdto{
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsEmail({},{message:'please enter valid email'})
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string

}