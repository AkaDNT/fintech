import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(cookieParser());
  // Kiểu A: web app.domain.com gọi api api.domain.com
  app.enableCors({
    origin: [config.get<string>('WEB_ORIGIN') ?? 'http://localhost:3000'],
    credentials: true,
  });

  const port = config.get<string>('PORT') ?? 3999;
  await app.listen(port);
}
bootstrap();
