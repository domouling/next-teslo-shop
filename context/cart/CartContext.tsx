import { createContext } from 'react';
import { ICartProduct, IShippingAddress } from '@/interfaces';

interface ContextProp {
      isLoaded: boolean;
      cart: ICartProduct[];
      numberOfitems: number;
      subTotal: number;
      tax: number;
      total: number;

      shippingAddress?: IShippingAddress;

      //Methds
      addProductToCart: (product: ICartProduct) => void;
      updateCartQuantity: (product: ICartProduct) => void;
      removeCartProduct: (product: ICartProduct) => void;
      updatedAddress: (address: IShippingAddress) => void;
      createOrder: () => Promise<{ hasError: boolean; message: string; }>;
}

export const CartContext = createContext({} as ContextProp);