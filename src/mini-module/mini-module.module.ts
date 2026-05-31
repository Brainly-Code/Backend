import { Module } from '@nestjs/common';
import { MiniModuleController } from './mini-module.controller';
import { MiniModuleService } from './mini-module.service';

@Module({
  controllers: [MiniModuleController],
  providers: [MiniModuleService]
})
export class MiniModuleModule {}
