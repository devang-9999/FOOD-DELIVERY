/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { Restaurant } from "./entities/restaurant.entity";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}


  private ensureSeller(role: string) {
    if (role.toUpperCase() !== "RESTAURANT OWNER") {
      throw new BadRequestException("Only sellers are allowed");
    }
  }


  async createRestaurentBySeller(
    sellerId: number,
    role: string,
    dto: CreateRestaurantDto,
    images: string[],
  ) {
    this.ensureSeller(role);

    const restaurant = this.restaurantRepository.create({
      name: dto.name,
      description: dto.description,
      location: dto.location,
      images,
      seller: { id: sellerId },
    });

    return this.restaurantRepository.save(restaurant);
  }


  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.restaurantRepository.findAndCount({
      skip,
      take: limit,
      order: { id: "ASC" },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async updateRestaurantBySeller(
    restaurantId: number,
    sellerId: number,
    role: string,
    dto: UpdateRestaurantDto,
  ) {
    this.ensureSeller(role);

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ["seller"],
    });

    if (!restaurant) {
      throw new NotFoundException("Product not found");
    }

    if (restaurant.seller.id !== sellerId) {
      throw new BadRequestException(
        "You can update only your own restaurants",
      );
    }

    Object.assign(restaurant, {
      ...dto,
    });

    return this.restaurantRepository.save(restaurant);
  }


  async searchRestaurants(searchTerm: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.restaurantRepository.findAndCount({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
      skip,
      take: limit,
      order: { id: "ASC" },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }


  async findOne(id: number) {
    const product = await this.restaurantRepository.findOne({
      where: { id },
      relations: ["seller"],
    });

    if (!product) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return product;
  }


}