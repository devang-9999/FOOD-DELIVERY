import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Dish } from './entities/dish.entity';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly productRepository: Repository<Dish>,
  ) {}

  private ensureSeller(role: string) {
    if (role.toUpperCase() !== 'RESTAURANT OWNER') {
      throw new BadRequestException('Only sellers are allowed');
    }
  }

  async createProductBySeller(
    sellerId: number,
    role: string,
    dto: CreateDishDto,
    images: string[],
  ) {
    this.ensureSeller(role);

    const product = this.productRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category.trim().toUpperCase(),
      brand: dto.brand.trim().toUpperCase(),
      stock: dto.stock,
      images,
      seller: { id: sellerId },
    });

    return this.productRepository.save(product);
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async getProductsBySeller(sellerId: number, role: string) {
    this.ensureSeller(role);

    return this.productRepository.find({
      where: { seller: { id: sellerId } },
      order: { id: 'DESC' },
    });
  }

  async updateProductBySeller(
    productId: number,
    sellerId: number,
    role: string,
    dto: UpdateDishDto,
  ) {
    this.ensureSeller(role);

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.seller.id !== sellerId) {
      throw new BadRequestException('You can update only your own products');
    }

    Object.assign(product, {
      ...dto,
      category: dto.category
        ? dto.category.trim().toUpperCase()
        : product.category,
      brand: dto.brand ? dto.brand.trim().toUpperCase() : product.brand,
    });

    return this.productRepository.save(product);
  }

  async searchProducts(searchTerm: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByCategory(category: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const normalizedCategory = category.trim().toUpperCase();

    const [data, total] = await this.productRepository.findAndCount({
      where: { category: normalizedCategory },
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async banUser(dishId: number) {
    const user = await this.productRepository.findOne({
      where: { id: dishId },
    });

    if (!user) throw new NotFoundException('User not found');

    user.isBanned = true;
    return this.productRepository.save(user);
  }

  async unbanUser(dishId: number) {
    const user = await this.productRepository.findOne({
      where: { id: dishId },
    });

    if (!user) throw new NotFoundException('User not found');

    user.isBanned = false;
    return this.productRepository.save(user);
  }
}
