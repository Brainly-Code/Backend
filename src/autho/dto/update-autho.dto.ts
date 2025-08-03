import { PartialType } from '@nestjs/swagger';
import { CreateAuthoDto } from './create-autho.dto';

export class UpdateAuthoDto extends PartialType(CreateAuthoDto) {}
