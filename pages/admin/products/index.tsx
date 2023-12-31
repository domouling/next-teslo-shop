import useSWR from 'swr';

import NextLink from 'next/link';

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material";

import { AdminLayout } from "@/components/layouts";
import { IProduct } from "@/interfaces";

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Foto' ,
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                <a href={ `/product/${ row.slug }` } target="_blank" rel="noreferrer">
                    <CardMedia 
                        component='img'
                        className='fedeIn'
                        image={ row.img }
                        alt={ row.title }
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Title', 
        width: 250,
        renderCell: ({row}: GridRenderCellParams) => {
            return (
               <NextLink href={`/admin/products/${ row.slug }`} legacyBehavior passHref>
                    <Link underline='always'>
                        { row.title }
                    </Link>
               </NextLink>
            )
        } 
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if ( !data && !error ) return (<></>);

    const rows = data!.map( product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }));

    return (
        <AdminLayout
            title={`Productos (${ data?.length })`}
            subtitle="Mantenimiento de Productos"
            icon={ <CategoryOutlined /> }
        >

            <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
                <Button
                    startIcon={ <AddOutlined /> }
                    color='secondary'
                    href='/admin/products/new'
                >
                    Crear Producto
                </Button>
            </Box>

            <Grid container className='fadeIn'>
                <Grid item xs={ 12 } sx={{ height: 650, width: '100%' }}>
                    <DataGrid 
                        rows={ rows }
                        columns={ columns }
                        initialState={{
                            pagination: { 
                                paginationModel: { pageSize: 10 } 
                            },
                        }}
                        pageSizeOptions={[5, 10, 25, 50]}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default ProductsPage