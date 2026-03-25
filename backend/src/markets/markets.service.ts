import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Market } from './entities/market.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Market)
    private readonly marketsRepository: Repository<Market>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Market[]> {
    return this.marketsRepository.find({
      relations: ['creator'],
    });
  }

  async findById(id: string): Promise<Market | null> {
    return this.marketsRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
  }

  /**
   * Find a market by UUID or on_chain_market_id.
   * Returns the market with nested creator object (username, stellar_address,
   * reputation_score). Throws NotFoundException if not found.
   */
  async findByIdOrOnChainId(id: string): Promise<Market> {
    const market = await this.marketsRepository.findOne({
      where: [{ id }, { on_chain_market_id: id }],
      relations: ['creator'],
    });

    if (!market) {
      throw new NotFoundException(`Market with ID "${id}" not found`);
    }

    return market;
  }
}
