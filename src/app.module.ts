import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { User } from './users/entity/user.entity';

enum DB_TYPE {
    POSTGRES = 'postgres',
    MYSQL = 'mysql',
    MARIADB = 'mariadb',
    SQLITE = 'sqlite',
}

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: `${process.env.DB_TYPE}` as DB_TYPE,
            host: `${process.env.DB_URL}`,
            port: 5432,
            username: `${process.env.DB_USERNAME}`,
            password: `${process.env.DB_PASSWORD}`,
            database: `${process.env.DB_NAME}`,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
