import { Module } from '@nestjs/common';
import { ResponseService } from 'src/commons/response/response.service';

@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class CommonsModule {}
