import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService
  ){
    //? No deberiamos de hacer esto (no quiere decir que sea algo malo, solo que normalmente no se hace)
    //? pero como tenermos que inyectar el repositorio y estamos
    //? Poniendo el contructor entonces debos hacer el super
    super({
      secretOrKey: configService.get<string>('JWT_SECRET')!.toString(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate( payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({id})

    if(!user)
      throw new UnauthorizedException('Token not valid')

    if(!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin')

    return user;
  }
}
