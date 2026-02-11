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
import { DishesService } from "./dishes.service";
import { CreateDishDto } from "./dto/create-dish.dto";
import { UpdateDishDto } from "./dto/update-dish.dto";
import { multerOptions } from "../database/multerConfiguration/multerConfiguration";

@Controller("products")
export class DishesController {
  constructor(private readonly productsService: DishesService) {}

  @Get("all")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.productsService.findAll(
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get("search")
  searchProducts(
    @Query("searchTerm") searchTerm?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    if (!searchTerm || !searchTerm.trim()) {
      throw new BadRequestException("searchTerm is required");
    }

    return this.productsService.searchProducts(
      searchTerm.trim(),
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get("category/:category")
  findByCategory(
    @Param("category") category: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.productsService.findByCategory(
      category,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get("seller/:sellerId")
  getProductsBySeller(
    @Param("sellerId", ParseIntPipe) sellerId: number,
  ) {
    return this.productsService.getProductsBySeller(
      sellerId,
      "RESTAURANT OWNER",
    );
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor("images", 5, multerOptions))
  createProduct(
    @Body() dto: CreateDishDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("At least one image is required");
    }

    return this.productsService.createProductBySeller(
      dto.sellerId,
      "RESTAURANT OWNER",
      dto,
      files.map((f) => f.filename),
    );
  }

  @Patch(":id")
  updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDishDto,
  ) {
    if (!dto.sellerId) {
      throw new BadRequestException("sellerId is required");
    }

    return this.productsService.updateProductBySeller(
      id,
      dto.sellerId,
      "RESTAURANT OWNER",
      dto,
    );
  }

    @Patch('ban/:id')
  ban(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.banUser(id);
  }

  @Patch('unban/:id')
  unban(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.unbanUser(id);
  }
}