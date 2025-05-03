import ApiClient from "./api-client";

export default interface StockService {
  increaseStock(sku: string, quantity: number): Promise<void>;
}

export class StockApiService implements StockService {
  private readonly client: ApiClient;

  public constructor(client: ApiClient) {
    this.client = client;
  }

  public async increaseStock(sku: string, quantity: number): Promise<void> {
    return await this.client.put(`/shopping/api/stock-items/${sku}/increase-stock`, {
      quantity: quantity
    });
  }
}