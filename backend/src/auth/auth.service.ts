import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../common/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolePermissions } from '../common/enums/permissions.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      permissions: RolePermissions[user.role] || []
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        permissions: RolePermissions[user.role] || []
      }
    };
  }

  async register(registerDto: RegisterDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: registerDto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Déterminer le rôle (utiliser celui fourni ou le rôle par défaut)
    const userRole = registerDto.role || UserRole.USER;

    // Créer le nouvel utilisateur
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: userRole,
    });

    const savedUser = await this.usersRepository.save(user);

    // Générer le token JWT
    const payload = { 
      email: savedUser.email, 
      sub: savedUser.id, 
      role: savedUser.role,
      permissions: RolePermissions[savedUser.role] || []
    };

    return {
      message: `Utilisateur ${savedUser.role.toLowerCase()} créé avec succès`,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
        phone: savedUser.phone,
        address: savedUser.address,
        permissions: RolePermissions[savedUser.role] || []
      },
      access_token: this.jwtService.sign(payload)
    };
  }

  async refreshToken(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      permissions: RolePermissions[user.role] || []
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changeUserRole(userId: string, newRole: UserRole, adminUser: any) {
    // Vérifier que l'utilisateur qui fait la demande est admin
    if (adminUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Accès refusé');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    user.role = newRole;
    await this.usersRepository.save(user);

    return {
      message: 'Rôle utilisateur mis à jour',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: RolePermissions[user.role] || []
      }
    };
  }
} 