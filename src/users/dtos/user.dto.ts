import { IsOptional, IsString, IsEmail } from 'class-validator';

export interface User {
    id: string;
    name: string;
    email: string;
}

export class CreateUserDto {
    @IsOptional()
    @IsString()
    name: string;
    @IsOptional()
    @IsString()
    email: string;
    password: string;
}

export class LoginUserDto {
    @IsOptional()
    @IsString()
    name: string;
    @IsOptional()
    @IsString()
    password: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    password: string;
}
