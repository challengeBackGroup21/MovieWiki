// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// // import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import * as config from 'config';

// const dbConfig = config.get('elastic');
// @Module({
//   imports: [
//     ConfigModule,
//     ElasticsearchModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         node: configService.get(dbConfig.node),
//         auth: {
//           username: configService.get(dbConfig.username),
//           password: configService.get(dbConfig.password),
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   exports: [ElasticsearchModule],
// })
// export class SearchModule {}
