export default interface ProductDto {
  sku: string
  name: string
  description: string
  price: number
  categoryId: number
  categoryName: string
  primaryImageId: string
  supportingImageIds: string[]
  isFeatured: boolean
}