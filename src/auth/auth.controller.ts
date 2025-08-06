import { Controller, Post, Body, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto  } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiOperation({ summary: 'Check current user session' })
  @ApiResponse({ status: 200, description:'User info and the token to refresh'})
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @ApiOperation({ summary: 'Basic private route using AuthGuard' })
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
  @ApiOperation({ summary: 'Basic private route using AuthGuard and SetMetaData to validate roles' })
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
  @ApiOperation({ summary: 'Basic private route without SetMetaData' })
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
  @ApiOperation({ summary: 'Basic private route using my own decorator' })
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
