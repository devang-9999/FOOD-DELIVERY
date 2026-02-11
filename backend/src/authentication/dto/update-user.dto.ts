import { PartialType } from '@nestjs/mapped-types';
import { SignUp } from './sign-up.dto';

export class UpdateUserDto extends PartialType(SignUp) {}
