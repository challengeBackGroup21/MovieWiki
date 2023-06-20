import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cluster from 'node:cluster';
import process from 'node:process';
import config from 'config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = serverConfig.port;

  app.use(cookieParser());
  // class-validator 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 프로퍼티 자동 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 프로퍼티 요청에 포함 > 요청 거부
      transform: true, // 받아온 데이터를 DTO 클래스로 변환해줌
    }),
  );
  // httpExceptionFilter 적용
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
}

if (cluster.isPrimary) {
  const numCPUs = require('os').cpus().length;
  console.log(`Master ${process.pid} is running`);

  // 워커 프로세스 생성
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 워커가 종료되었을 때 새로운 워커 생성
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  bootstrap().catch((error) => console.error(error));
}