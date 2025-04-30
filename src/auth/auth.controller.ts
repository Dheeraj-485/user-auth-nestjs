import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RoleGuard } from '../guards/role.guard';
import { CONSTANTS } from '../utils/constants';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { JwtAuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req): { message: string; token: string; user: any } {
    const token = this.authService.generateToken(req.user);
    const { password, ...userWithoutPassword } = req.user;
    return {
      message: 'User login successfully',
      token,
      user: userWithoutPassword,
    };
  }
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('userRole')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(CONSTANTS.ROLE.USER))
  normalUserRole(@Request() req): string {
    return `This is private data for ${JSON.stringify(req.user)}`;
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  // @UseGuards(JwtAuthGuard)
  updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.id.toString() !== id.toString()) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.userService.updateUser(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
