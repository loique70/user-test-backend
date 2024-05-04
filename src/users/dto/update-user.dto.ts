import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from '../../auth/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateAuthDto) {}
