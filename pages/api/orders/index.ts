import { IOrder } from '@/interfaces';
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { db } from '@/database';
import { Order, Product } from '@/models';

type Data = 
| { message: string }
| IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder( req, res );

        default:
            return res.status(400).json({ message: 'Bad Request' })

    }

}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;
     
    //Verificar usuario
    //const session: any = await getSession({ req });
    //const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session: any = await getServerSession(req, res, authOptions);

    if( !session ) return res.status(401).json({ message: 'Unauthorized' });

    //Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map( product => product._id );
    
    await db.connect();

    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {

        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find( prod => prod.id === current._id )!.price;

            if ( !currentPrice ) {
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }

            return (currentPrice * current.quantity) + prev
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * ( taxRate + 1 );

        if ( backendTotal !== total ) {
            throw new Error('Total no cuadra con el monto');
        }

        // Aca todo bien hasta este punto
        const userId = session.user._id;
        const newOrder = new Order({...req.body, isPaid: false, user: userId});

        newOrder.total = Math.round( newOrder.total * 100 ) / 100;

        await newOrder.save();
        
        await db.disconnect();

        return res.status(201).json( newOrder );
        
    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: error.message || 'Revise logs del server' });
    }

    //return res.status(201).json(req.body);

}
