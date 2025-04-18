import userManager from "@/oidc/user-manager";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export interface ProblemDetails {
  statusCode: number
  title: string
  detail: string
}

export class ProblemDetailsError extends Error {
  public readonly problemDetails: ProblemDetails;

  public constructor(problemDetails: ProblemDetails) {
    super(problemDetails.detail);

    this.problemDetails = problemDetails;
  }
}

export default class ApiClient {
  private readonly axios: AxiosInstance;

  public constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json"
      }
    });

    this.axios.interceptors.request.use(async (config) => {
      const user = await userManager.getUser();

      if (user?.access_token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${user.access_token}`,
        } as AxiosRequestHeaders;
      }

      return config;
    });

    this.axios.interceptors.response.use((response) => response, async (error) => {
      if (error.response?.status === 401) {
        try {
          await userManager.signinSilent();
          const user = await userManager.getUser();
  
          if (user?.access_token) {
            error.config.headers.Authorization = `Bearer ${user.access_token}`;
            return this.axios.request(error.config);
          }
        } catch (refreshError) {
          userManager.signinRedirect();
        }
      }

      throw new ProblemDetailsError(error.response.data);
    });
  }

  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.get<T>(endpoint, config);
    return response.data;
  }

  public async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.post<T>(endpoint, data, config);
    return response.data;
  }

  public async put<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.put<T>(endpoint, data, config);
    return response.data;
  }

  public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(endpoint, config);
    return response.data;
  }
}

const rookieShopApiClient = new ApiClient("http://localhost:5027");

export { rookieShopApiClient };