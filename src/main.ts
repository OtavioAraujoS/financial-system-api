import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    await app.listen(process.env.PORT || 6669);

    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
