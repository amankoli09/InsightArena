import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketsService } from './markets.service';
import { Market } from './entities/market.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Fetch all markets' })
  @ApiResponse({
    status: 200,
    description: 'Markets retrieved successfully',
    type: [Market],
  })
  async getAllMarkets(): Promise<Market[]> {
    return this.marketsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Fetch market by UUID or on-chain market ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Market with nested creator profile',
    type: Market,
  })
  @ApiResponse({ status: 404, description: 'Market not found' })
  async getMarketById(@Param('id') id: string): Promise<Market> {
    return this.marketsService.findByIdOrOnChainId(id);
  }
}
