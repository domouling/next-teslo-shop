import jwt from 'jsonwebtoken';

export const signToken = ( _id: string, email: string ) => {

    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('Seed Secret not found JWT');
    }

    return jwt.sign(
        //paylaoad
        { _id, email },
        //seed
        process.env.JWT_SECRET_SEED,
        //Opciones
        { expiresIn: '30d' }
    )

}


export const isValidToken = ( token: string ):Promise<string> => {
    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('Seed Secret not found JWT');
    }

    if (token.length <= 10) {
        return Promise.reject('JWT not valid');
    }

    return new Promise( (resolve, reject) => {

        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) return reject('JWT not valid');

                const { _id } = payload as { _id: string };

                resolve(_id);
            })
        } catch (error) {
            reject('JWT not valid');
        }

    })

}