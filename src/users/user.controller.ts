import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { User } from './entity/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dtos/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'Return all users.',
        type: [User],
    })
    @Get('all')
    async getAllUsers() {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiOperation({ summary: 'Get user infos' })
    @ApiResponse({ status: 200, description: 'Return a user.', type: [User] })
    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<User> {
        if (isNaN(id)) {
            throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.getUserById(id);
        if (!user || typeof user.id !== 'number') {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User logged in.', type: User })
    @ApiResponse({
        status: 404,
        description: 'User not found or incorrect password.',
    })
    @ApiBody({ type: LoginUserDto })
    @Post('login')
    async login(@Body() loginUserDto: Partial<LoginUserDto>) {
        return this.userService.loginUser(loginUserDto);
    }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created.', type: User })
    @ApiResponse({ status: 400, description: 'User already exists.' })
    @ApiBody({ type: CreateUserDto })
    @Post('create')
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @ApiOperation({ summary: 'Update user information' })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully.',
        type: User,
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiBody({ type: UpdateUserDto })
    @Put('update-infos/:id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const updateResult = await this.userService.updateUser(
            id,
            updateUserDto,
        );
        if (!updateResult.affected) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const user = await this.userService.getUserById(id);
        if (!user || typeof user.id !== 'number') {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @ApiOperation({ summary: 'Update user password' })
    @ApiResponse({ status: 200, description: 'Password updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiBody({ type: UpdateUserDto })
    @Put('update-password/:id')
    async updatePassword(
        @Param('id') id: number,
        @Body() updatePasswordDto: UpdateUserDto,
    ) {
        try {
            return await this.userService.updateUser(id, updatePasswordDto);
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        try {
            return await this.userService.deleteUser(id);
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
