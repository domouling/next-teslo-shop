import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
 | { message: string }
 | IProduct;

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProductBySlug( req, res );

            
        default:
            return res.status(400).json({message: "Bad Request"});
    }

}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { slug } = req.query;

    if ( !slug ) {
        return res.status(400).json({message: "Bad Request"});
    }

    await db.connect();

    const slugInDb = await Product.findOne({ slug }).lean();

    await db.disconnect();

    if ( !slugInDb ) {
        return res.status(404).json({message: `Not Found Product with slug ${ slug }`});
    }

    slugInDb.images = slugInDb.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    });

    return res.json( slugInDb );

}