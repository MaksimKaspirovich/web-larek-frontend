import {
	FormErrors,
	IProductItem,
	IBasket,
	PaymentMethod,
	IOrderForm,
} from '../types';
import { IEvents } from './base/events';

export class AppData {
	items: IProductItem[] = [];
	preview: IProductItem | null = null;
	basket: IBasket = { items: [], total: 0 };
	order: IOrderForm = {
		email: '',
		phone: '',
		address: '',
		payment: 'card',
	};
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.clearBasket();
		this.clearOrder();
	}

	setItems(items: IProductItem[]) {
		this.items = items;
		this.events.emit('items:change', this.items);
	}

	setPreview(item: IProductItem) {
		this.preview = item;
		this.events.emit('preview:change', this.preview);
	}

	inBasket(item: IProductItem): boolean {
		return this.basket.items.includes(item.id);
	}

	addItemToBasket(item: IProductItem) {
		if (item.price !== null) {
			this.basket.items.push(item.id);
			this.basket.total += item.price;
			this.events.emit('basket:change', this.basket);
		}
	}

	removeItemFromBasket(item: IProductItem) {
		this.basket.items = this.basket.items.filter((id) => id !== item.id);
		if (item.price !== null) {
			this.basket.total -= item.price;
		}
		this.events.emit('basket:change', this.basket);
	}

	clearBasket() {
		this.basket = { items: [], total: 0 };
		this.events.emit('basket:change', this.basket);
	}

	setPayment(method: PaymentMethod) {
		this.order.payment = method;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		if (field === 'payment') {
			this.setPayment(value as PaymentMethod);
		} else {
			this.order[field] = value;
		}
	}

	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: 'card',
		};
		this.formErrors = {};
	}

	validateOrderPayment(): boolean {
		const errors: FormErrors = {};
		if (!this.order.address?.trim()) {
			errors.address = 'Необходимо указать адрес';
		}
		this.updateFormErrors(errors, 'orderFormErrors:change');
		return Object.keys(errors).length === 0;
	}

	validateOrderDelivery(): boolean {
		const errors: FormErrors = {};
		if (!this.validateEmail(this.order.email)) {
			errors.email = 'Некорректный email';
		}
		if (!this.validatePhone(this.order.phone)) {
			errors.phone = 'Некорректный телефон';
		}
		this.updateFormErrors(errors, 'contactsFormErrors:change');
		return Object.keys(errors).length === 0;
	}

	private updateFormErrors(errors: FormErrors, eventName: string) {
		this.formErrors = { ...errors };
		this.events.emit(eventName, { ...this.formErrors });
	}

	private validateEmail(email: string): boolean {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return email.trim() !== '' && emailRegex.test(email.trim());
	}

	private validatePhone(phone: string): boolean {
		const phoneRegex =
			/^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
		return phone.trim() !== '' && phoneRegex.test(phone.trim());
	}
}
