/**
 * @fileoverview Serviço de autenticação da aplicação RecolheJá
 * @description Gerencia todas as operações relacionadas à autenticação de usuários,
 * incluindo login, registro e validação de credenciais.
 * 
 * @author Equipe RecolheJá
 * @version 1.0.0
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Interface que define a estrutura do payload do JWT
 */
export interface JwtPayload {
  sub: string;   // ID do usuário (subject)
  email: string; // Email do usuário
}

/**
 * Serviço responsável pela autenticação e autorização de usuários
 * 
 * Funcionalidades:
 * - Validação de credenciais de login
 * - Geração de tokens JWT
 * - Registro de novos usuários
 * - Hash seguro de senhas
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, // Serviço de acesso ao banco de dados
    private jwtService: JwtService, // Serviço de geração e validação de JWT
  ) {}

  /**
   * Valida as credenciais de um usuário durante o login
   * 
   * @param email - Email do usuário
   * @param password - Senha em texto plano
   * @returns Dados do usuário sem a senha hash
   * @throws UnauthorizedException - Se as credenciais forem inválidas
   */
  async validateUser(email: string, password: string) {
    // Busca o usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Verifica se o usuário existe
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compara a senha fornecida com o hash armazenado
    const isPasswordValid = await compare(password, user.passwordHash);

    // Verifica se a senha está correta
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove a senha hash antes de retornar os dados do usuário
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Realiza o login do usuário e gera um token JWT
   * 
   * @param user - Dados do usuário validado
   * @returns Token de acesso e dados básicos do usuário
   */
  async login(user: any) {
    // Cria o payload do JWT com informações essenciais
    const payload: JwtPayload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload), // Gera o token JWT
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  /**
   * Registra um novo usuário no sistema
   * 
   * @param name - Nome completo do usuário
   * @param email - Email único do usuário
   * @param password - Senha em texto plano
   * @returns Dados do usuário criado (sem senha)
   * @throws UnauthorizedException - Se o email já estiver em uso
   */
  async register(name: string, email: string, password: string) {
    // Verifica se já existe um usuário com este email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Gera um hash seguro da senha usando bcrypt com salt de 8 rounds
    const hashedPassword = await hash(password, 8);

    // Cria o novo usuário no banco de dados
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    // Remove a senha hash antes de retornar os dados
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
