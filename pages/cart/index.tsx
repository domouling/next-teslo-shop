import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { CartContext } from "@/context";
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";

const CartPage = () => {

  const { numberOfitems, isLoaded } = useContext(CartContext);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !numberOfitems) {
        router.replace('/cart/empty');
    }
  }, [isLoaded, numberOfitems, router]);

  if (!numberOfitems) {
    return (<></>);
  }
  

  return (
    <ShopLayout title={`Carrito - ${ numberOfitems } ${ numberOfitems > 1 ? 'productos' : 'producto' }`} pageDescription="Carrito de compra de la tienda">
        <Typography variant="h1" component="h1">Carrito</Typography>

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className="sumary-card">
                    <CardContent>
                        <Typography variant="h2">Orden</Typography>
                        <Divider sx={{ my: 1 }}/>

                        <OrderSummary />

                        <Box sx={{ mt: 3 }}>
                            <Button 
                                color="secondary" 
                                className="circular-btn" 
                                fullWidth
                                href="/checkout/address"
                            >
                                Checkout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    </ShopLayout>
  )
}

export default CartPage