import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {

  runSeed() {
    return `This action returns seed`;
  }
}
