/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../database/multerConfiguration/multerConfiguration";
import { RestaurantService } from "./restaurants.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@Controller("restaurants")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get("all")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.restaurantService.findAll(
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get("search")
  searchRestaurants(
    @Query("searchTerm") searchTerm?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    if (!searchTerm || !searchTerm.trim()) {
      throw new BadRequestException("searchTerm is required");
    }

    return this.restaurantService.searchRestaurants(
      searchTerm.trim(),
      Number(page) || 1,
      Number(limit) || 20,
    );
  }


  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.restaurantService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor("images", 5, multerOptions))
  createProduct(
    @Body() dto: CreateRestaurantDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("At least one image is required");
    }

    return this.restaurantService.createRestaurentBySeller(
      dto.sellerId,
      "RESTAURANT OWNER",
      dto,
      files.map((f) => f.filename),
    );
  }

  @Patch(":id")
  updateRestaurant(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantDto,
  ) {
    if (!dto.sellerId) {
      throw new BadRequestException("sellerId is required");
    }

    return this.restaurantService.updateRestaurantBySeller(
      id,
      dto.sellerId,
      "RESTAURANT OWNER",
      dto,
    );
  }
}