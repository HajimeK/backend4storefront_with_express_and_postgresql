import client from '../database';

export type OrderItem = {
    id: number,
    product_id: number,
    quantity: number,
    user_id: number,
    order_status_id: number
}


