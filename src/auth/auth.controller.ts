import { Controller, Post, Body, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto  } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  privateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    // @GetUser('id', ParseUUIDPipe) id: User
    // @Req() request: Express.Request,
  ){
    // console.log(request.user)
    return{
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ){
    return{
      ok: true,
      user
    }
  }


  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private3')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard) //? Sirve para enviar la request y luego nos permite acceder a ella
  privateRoute3(
    @GetUser() user: User,
  ){
    return{
      ok: true,
      message: 'Hi im private 3',
      user
    }
  }

  @Get('private4')
  @Auth(ValidRoles.superUser)
  privateRoute4(
    @GetUser() user: User,
  ){
    return{
      ok: true,
      message: 'Hi im private 4',
      user
    }
  }

}
