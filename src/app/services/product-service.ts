import Pagination from "../models/pagination";
import ProductDto from "../models/product-dto";
import ApiClient from "./api-client";

export default interface ProductService {
  getProductBySku(sku: string) : Promise<ProductDto>;
  getProducts(pageNumber: number, pageSize: number) : Promise<Pagination<ProductDto>>;
  getSemanticallyOrderedProducts(semantic: string, pageNumber: number, pageSize: number) : Promise<Pagination<ProductDto>>;
  createProduct(sku: string, name: string, description: string, price: number, categoryId: number, primaryImageId: string, supportingImageIds: Set<string>, isFeatured: boolean) : Promise<void>
  updateProduct(sku: string, name: string, description: string, price: number, categoryId: number, primaryImageId: string, supportingImageIds: Set<string>, isFeatured: boolean) : Promise<void>
  deleteProduct(sku: string) : Promise<void>
}

export class ProductApiService implements ProductService {
  private readonly client: ApiClient;

  public constructor(client: ApiClient) {
    this.client = client;
  }
  
  public async getProductBySku(sku: string): Promise<ProductDto> {
    return await this.client.get(`/product-catalog/api/products/${sku}`);
  }

  public async getProducts(pageNumber: number, pageSize: number): Promise<Pagination<ProductDto>> {
    return await this.client.get("/product-catalog/api/products/all", {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  public async getSemanticallyOrderedProducts(semantic: string, pageNumber: number, pageSize: number): Promise<Pagination<ProductDto>> {
    return await this.client.get("/product-catalog/api/products/semantic", {
      params: {
        semantic: semantic,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  public async createProduct(sku: string, name: string, description: string, price: number, categoryId: number, primaryImageId: string, supportingImageIds: Set<string>, isFeatured: boolean): Promise<void> {
    await this.client.post("/product-catalog/api/products", {
      sku: sku,
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
      primaryImageId: primaryImageId,
      supportingImageIds: Array.from(supportingImageIds),
      isFeatured: isFeatured
    });
  }

  public async updateProduct(sku: string, name: string, description: string, price: number, categoryId: number, primaryImageId: string, supportingImageIds: Set<string>, isFeatured: boolean): Promise<void> {
    await this.client.put(`/product-catalog/api/products/${sku}`, {
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
      primaryImageId: primaryImageId,
      supportingImageIds: Array.from(supportingImageIds),
      isFeatured: isFeatured
    });
  }

  public async deleteProduct(sku: string): Promise<void> {
    await this.client.delete(`/product-catalog/api/products/${sku}`);
  }
}