import CustomerDto from "../models/customer-dto";
import ApiClient from "./api-client";

export default interface CustomerService {
  getCustomers(pageNumber: number, pageSize: number) : Promise<CustomerDto[]>
}

export class CustomerApiService implements CustomerService {
  private readonly client: ApiClient;

  public constructor(client: ApiClient) {
    this.client = client;
  }

  public async getCustomers(pageNumber: number, pageSize: number): Promise<CustomerDto[]> {
    return await this.client.get("/api/Customer", {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }
}