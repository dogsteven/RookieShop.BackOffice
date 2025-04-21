import ImageDto from "../models/image-dto";
import Pagination from "../models/pagination";
import ApiClient from "./api-client";

export default interface ImageGalleryService {
  getImages(pageNumber: number, pageSize: number): Promise<Pagination<ImageDto>>;
  uploadImage(file: Blob): Promise<void>;
  deleteImage(id: string): Promise<void>;
}

export class ImageGalleryApiService implements ImageGalleryService {
  private readonly client: ApiClient;

  public constructor(client: ApiClient) {
    this.client = client;
  }
  
  public async getImages(pageNumber: number, pageSize: number): Promise<Pagination<ImageDto>> {
    return this.client.get("/api/ImageGallery", {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  public async uploadImage(file: Blob): Promise<void> {
    var form = new FormData();
    form.append("File", file);

    await this.client.post("/api/ImageGallery", form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  public async deleteImage(id: string): Promise<void> {
    await this.client.delete(`/api/ImageGallery/${id}`);
  }
}