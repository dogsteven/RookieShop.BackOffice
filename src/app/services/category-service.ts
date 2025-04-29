import CategoryDto from "../models/category-dto";
import ApiClient from "./api-client";

export default interface CategoryService {
  getCategories() : Promise<CategoryDto[]>
  createCategory(name: string, description: string) : Promise<number>
  updateCategory(id: number, name: string, description: string) : Promise<void>
  deleteCategory(id: number) : Promise<void>
}

export class CategoryApiService implements CategoryService {
  private readonly client: ApiClient;

  public constructor(client: ApiClient) {
    this.client = client;
  }

  public async getCategories(): Promise<CategoryDto[]> {
    return await this.client.get("/product-catalog/api/categories");
  }

  public async createCategory(name: string, description: string): Promise<number> {
    const { id } = await this.client.post<{ id: number }>("/product-catalog/api/categories", {
      name: name,
      description: description
    });

    return id;
  }

  public async updateCategory(id: number, name: string, description: string): Promise<void> {
    await this.client.put(`/product-catalog/api/categories/${id}`, {
      name: name,
      description: description
    });
  }

  public async deleteCategory(id: number): Promise<void> {
    await this.client.delete(`/product-catalog/api/categories/${id}`);
  }
}