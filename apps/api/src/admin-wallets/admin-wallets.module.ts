import { Module } from '@nestjs/common';
import { AdminWalletsService } from './admin-wallets.service';
import { AdminWalletsController } from './admin-wallets.controller';

@Module({
  controllers: [AdminWalletsController],
  providers: [AdminWalletsService],
})
export class AdminWalletsModule {}
