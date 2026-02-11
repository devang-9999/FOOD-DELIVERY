import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUp } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Login } from './dto/login.dto';
import { FirebaseLogin } from './dto/firebaseLogin.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/signup')
  createUser(@Body() createUserDto: SignUp) {
    return this.authenticationService.signUp(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginDto: Login) {
    return this.authenticationService.login(loginDto);
  }

  @Post('googlelogin')
  googleloginUser(@Body() loginDto: FirebaseLogin) {
    return this.authenticationService.googleLogin(loginDto);
  }

  @Post('githublogin')
  githubloginUser(@Body() loginDto: FirebaseLogin) {
    return this.authenticationService.githubLogin(loginDto);
  }

  @Get()
  getAllUsers() {
    return this.authenticationService.getAllusers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authenticationService.getById(id);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authenticationService.updateById(+id, updateUserDto);
  }

  @Delete(':id')
  removeById(@Param('id') id: number) {
    return this.authenticationService.removeById(id);
  }

  @Patch('ban/:id')
  ban(@Param('id', ParseIntPipe) id: number) {
    return this.authenticationService.banUser(id);
  }

  @Patch('unban/:id')
  unban(@Param('id', ParseIntPipe) id: number) {
    return this.authenticationService.unbanUser(id);
  }
}
