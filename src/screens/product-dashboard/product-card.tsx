import ProductDto from "@/app/models/product-dto";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProductCardProps {
  product: ProductDto
};

function ProductCard(props: ProductCardProps) {
  const { product } = props;

  return (
    <Card>
      <CardContent>
        <img src={product.imageUrl} className="rounded-md aspect-square object-cover" />
      </CardContent>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default ProductCard;