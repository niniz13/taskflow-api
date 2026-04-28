import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../users/interface/user.interface';

// Helper pour créer un ExecutionContext mocké
const createMockContext = (role: string): ExecutionContext =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({
        user: { id: 'uuid', email: 'test@test.com', role },
      }),
    }),
  }) as any;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('autorise si aucun rôle requis (pas de @Roles)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    const context = createMockContext(UserRole.VIEWER);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('autorise si le rôle correspond', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const context = createMockContext(UserRole.ADMIN);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('refuse si le rôle est insuffisant', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const context = createMockContext(UserRole.VIEWER);

    expect(guard.canActivate(context)).toBe(false);
  });

  it("autorise si plusieurs rôles acceptés et l'un correspond", () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN, UserRole.MEMBER]);
    const context = createMockContext(UserRole.MEMBER);

    expect(guard.canActivate(context)).toBe(true);
  });
});
