export interface IProductItem {// взаимодействие с API для карточек товара
    id: string;
    descriptions: string; 
    image: string;
    title: string;
    catergory: string;
    price: number | null;
}

export interface IBasket {
    items: string[];
    total: number;
}

export type PaymentMEthod = 'cash' | 'card';

export interface IOrder { // взаимодействие с API для формы заказа
    payment: PaymentMEthod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type IOrderForm = Pick<IOrder, 'payment' | 'address'>;
export type IOrderContacts = Pick<IOrder, 'phone' | 'email'>

export interface IOrderResult {
    id: string;
    total: number;
}
