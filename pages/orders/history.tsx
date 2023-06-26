import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

import { ShopLayout } from "@/components/layouts"
import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la orden o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Pagada"    variant='outlined' />
                    : <Chip color="error"   label="No Pagada" variant='outlined' />
            )
        }
    },

    {
        field: 'order',
        headerName: 'Orden No',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <NextLink legacyBehavior href={`/orders/${ params.row.orderId }`} passHref>
                <Link underline='always'>
                    Ver Orden
                </Link>
            </NextLink>
        )
    }
];


interface Props {
    orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const row = orders.map( (order, i) => ({
        id: i + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))

    return (
        <ShopLayout title="Historial de Ordenes" pageDescription="Historial de Ordenes del Cliente">
            <Typography variant="h1" component="h1">Historial de Ordenes</Typography>

            <Grid container className='fadeIn'>
                <Grid item xs={ 12 } sx={{ height: 650, width: '100%' }}>
                    <DataGrid 
                        rows={ row }
                        columns={ columns }
                        initialState={{
                            pagination: { 
                                paginationModel: { pageSize: 5 } 
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    
    const session: any = await getServerSession(req,res,authOptions);

    if ( !session ) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);
    
    return {
        props: {
            orders
        }
    }
}

export default HistoryPage