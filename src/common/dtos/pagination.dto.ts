import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @IsOptional()
  @IsPositive()
  // Trasformar data
  @Type(() => Number) // Seria como usar el > enableImplicitConversions: true
  limit?: number;

  @IsOptional()
  @Min(0)
  // Trasformar data
  @Type(() => Number) // Seria como usar el > enableImplicitConversions: true
  offset?: number;
}
