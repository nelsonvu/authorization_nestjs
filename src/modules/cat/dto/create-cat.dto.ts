import { Cat } from '../interfaces/cats.interface'

export class CreateCatDto implements Cat{
    age: number;
    breed: string;
    name: string;
}