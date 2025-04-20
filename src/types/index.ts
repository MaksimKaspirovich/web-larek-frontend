export interface IProductItem {
    readonly id: string;
    descriptions: string; 
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBasket {
    items: string[];
    total: number;
}

export type PaymentMethod = 'cash' | 'card';

export interface IOrder {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type IOrderForm = Omit<IOrder, 'total' | 'items'>;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type IOrderPayment = Pick<IOrderForm, 'payment' | 'address'>;
export type IOrderDelivery = Pick<IOrderForm, 'phone' | 'email'>

export interface ISuccessOrder {
    readonly id: string;
    total: number;
}
