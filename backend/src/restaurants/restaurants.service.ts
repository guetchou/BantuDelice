import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant, MenuItem } from '../common/entities';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({ relations: ['menuItems'] });
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ 
      where: { id },
      relations: ['menuItems']
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async create(createRestaurantDto: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async update(id: string, updateRestaurantDto: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async remove(id: string): Promise<void> {
    const restaurant = await this.findOne(id);
    await this.restaurantRepository.remove(restaurant);
  }

  // Menu items
  async addMenuItem(restaurantId: string, menuItemDto: Partial<MenuItem>): Promise<MenuItem> {
    const menuItem = this.menuItemRepository.create({
      ...menuItemDto,
      restaurantId,
    });
    return this.menuItemRepository.save(menuItem);
  }
} 