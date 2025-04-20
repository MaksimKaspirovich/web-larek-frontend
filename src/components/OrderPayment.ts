import { ensureElement } from '../utils/utils';
import { Form } from './common/Form';
import { IOrderPayment, PaymentMethod } from '../types';
import { IEvents } from './base/events';

export class OrderPayment extends Form<IOrderPayment> {
	protected _paymentCash: HTMLButtonElement;
	protected _paymentCard: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',
			this.container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',
			this.container
		);

		this._paymentCard.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});

		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});
	}

	set address(value: string) {
		this._address.value = value;
	}

	set payment(value: PaymentMethod) {
		this.toggleClass(this._paymentCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._paymentCash, 'button_alt-active', value === 'cash');
	}
}
