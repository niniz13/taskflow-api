
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // TODO:
    // 1. Lire les rôles requis via reflector.getAllAndOverride(ROLES_KEY, [...])
    // 2. Si aucun rôle requis → autoriser (return true)
    // 3. Récupérer l'user depuis request (context.switchToHttp().getRequest())
    // 4. Vérifier que user.role figure dans les rôles requis
    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.includes(user.role);
  }
}