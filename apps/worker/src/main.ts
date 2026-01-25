import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Worker chạy background, không listen HTTP
  await NestFactory.createApplicationContext(AppModule);
  // eslint-disable-next-line no-console
  console.log('Worker started');
}
bootstrap();
