import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CustomersService {
  authService: any;
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.customers.findMany({
      where: { deleted: false },
    });
  }

  async getById(id: number, req: Request) {
    const user = await this.prismaService.customers.findUnique({
      where: { id, deleted: false },
    });

    if (!user) throw new NotAcceptableException('User Not Found');

    return user;
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto) {
    const updateUser = await this.prismaService.customers.update({
      where: { id: id },
      data: updateCustomerDto,
    });

    if (!updateUser) throw new NotAcceptableException('User Not Found');
    return updateUser;
  }

  async deleteCustomer(id: number) {
    const customer = await this.prismaService.customers.findUnique({
      where: { id },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const deleteCustomer = await this.prismaService.customers.update({
      where: { id },
      data: { deleted: true },
    });

    return deleteCustomer;
  }

  async desableCustomer(id: number) {
    const customer = await this.prismaService.customers.findUnique({
      where: { id },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const updatedCustomer = await this.prismaService.customers.update({
      where: { id },
      data: { isActive: !customer.isActive },
    });

    return updatedCustomer;
  }

  async addCustomer(createCustomerDto: CreateCustomerDto) {
    const { lastName, firstName, poste, phone, email } = createCustomerDto;

    const foundUser = await this.prismaService.customers.findUnique({
      where: { email },
    });

    if (foundUser) throw new BadRequestException('Email already exists');

    const newCustomer = await this.prismaService.customers.create({
      data: {
        lastName,
        firstName,
        poste,
        phone,
        email,
        isActive: false,
      },
    });

    return {
      message: 'Registration was successful.',
      customer: newCustomer,
    };
  }
}
