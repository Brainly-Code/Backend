import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpgradeUserDto {
  @IsBoolean()
  @IsNotEmpty()
  isPremium!: boolean;
}