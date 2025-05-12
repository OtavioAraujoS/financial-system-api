// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    /**
     * Fetches all users from the database.
     * @returns {Promise<User[]>} A promise that resolves to an array of users.
     */
    async getAllUsers() {
        return this.userRepository.find();
    }

    /**
     * Retrieves a user by ID.
     * @param {number} id - The ID of the user.
     * @returns {Promise<User>} A promise that resolves to the user data.
     * @throws {NotFoundException} If the user is not found.
     */
    async getUserById(id: number, userWhoRequest?: number) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new Error('User not found');
        }
        if (userWhoRequest !== user.id) {
            throw new Error('Unauthorized');
        }

        return user;
    }
    /**
     * Creates a new user.
     * @param {Partial<User>} user - The user data to create.
     * @returns {Promise<User>} A promise that resolves to the created user.
     */
    async createUser(user: Partial<User>) {
        return this.userRepository.save(user);
    }

    /**
     * Logs in a user.
     * @param {Partial<User>} user - The user data to log in.
     * @returns {Promise<User>} A promise that resolves to the logged-in user.
     * @throws {Error} If the user is not found or password is incorrect.
     */
    async loginUser(user: Partial<User>) {
        const foundUser = await this.userRepository.findOne({
            where: { name: user.name, password: user.password },
        });
        if (!foundUser) {
            throw new Error('User not found or incorrect password');
        }
        return foundUser;
    }

    /**
     * Updates a user by ID.
     * @param {number} id - The ID of the user to update.
     * @param {Partial<User>} user - The user data to update.
     * @returns {Promise<UpdateResult>} A promise that resolves to the update result.
     */
    async updateUser(id: number, user: Partial<User>) {
        return this.userRepository.update(id, user);
    }

    /**
     * Deletes a user by ID.
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<DeleteResult>} A promise that resolves to the delete result.
     */
    async deleteUser(id: number) {
        return this.userRepository.delete(id);
    }
}
