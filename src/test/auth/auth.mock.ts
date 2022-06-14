/* eslint-disable @typescript-eslint/no-empty-function */
import User from '../../entities/user.entity';
import Role, { Roles } from '../../entities/role.entity';

const mockedRoleMember: Role = {
  name: Roles.MEMBER,
};
const mockedRoleAdmin: Role = {
  name: Roles.ADMIN,
};
const mockedRoleSystemAdmin: Role = {
  name: Roles.SYSTEMADMIN,
};

const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  address: null,
  roles: [mockedRoleSystemAdmin],
};

export { mockedUser, mockedRoleMember, mockedRoleAdmin, mockedRoleSystemAdmin };
