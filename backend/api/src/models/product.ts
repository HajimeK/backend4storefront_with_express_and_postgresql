import client from '../database';

export type ProductItem = {
    id: number,
    name: string,
    price: number,
    category: string
};

export class Product {
    async index(): Promise<ProductItem[]> {
        try {
            // @ts-ignore
            const conn = await Client.connect()
            const sql = 'SELECT * FROM books'

            const result = await conn.query(sql)

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Could not get books. Error: ${err}`)
        }
    }

    async show(id: string): Promise<Book> {
        try {
            const sql = 'SELECT * FROM books WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find book ${id}. Error: ${err}`)
        }
    }

    async create(b: Book): Promise<Book> {
        try {
            const sql = 'INSERT INTO books (title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *'
            // @ts-ignore
            const conn = await Client.connect()

            const result = await conn
            .query(sql, [b.title, b.author, b.totalPages, b.summary])

            const book = result.rows[0]

            conn.release()

            return book
        } catch (err) {
            throw new Error(`Could not add new book ${title}. Error: ${err}`)
        }
    }

    async delete(id: string): Promise<Book> {
        try {
            const sql = 'DELETE FROM books WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()

            const result = await conn.query(sql, [id])

            const book = result.rows[0]

            conn.release()

            return book
        } catch (err) {
            throw new Error(`Could not delete book ${id}. Error: ${err}`)
        }
    }

    - [OPTIONAL] Top 5 most popular products
    - [OPTIONAL] Products by category (args: product category)
    - categories
};