import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Roles {
  ADMIN = 'admin',
  MEMBER = 'member',
  SYSTEMADMIN = 'systemadmin',
}

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.MEMBER,
    unique: true,
  })
  public name: string;
}

export default Role;
