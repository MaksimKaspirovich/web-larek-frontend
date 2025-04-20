import { Component } from './base/components';
import { IProductItem } from '../types';
import { cardCategory } from '../utils/constants';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductItem> {
	protected _descriptions?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title?: HTMLElement;
	protected _category?: HTMLElement;
	protected _price?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._descriptions =
			container.querySelector('.card__description') || undefined;
		this._image = container.querySelector('.card__image') || undefined;
		this._title = container.querySelector('.card__title') || undefined;
		this._category = container.querySelector('.card__category') || undefined;
		this._price = container.querySelector('.card__price') || undefined;
		this._button = container.querySelector('.card__button') || undefined;

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		if (this._title) this.setText(this._title, value);
	}

	get title(): string {
		return this._title?.textContent || '';
	}

	set image(value: string) {
		if (this._image) this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		if (this._descriptions) this.setText(this._descriptions, value);
	}

	set price(value: string) {
		if (this._price) {
			this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		}
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	get price(): string {
		return this._price?.textContent || '';
	}

	set category(value: string) {
		if (!this._category) return;

		// Очищаем предыдущие классы категории
		this._category.className = 'card__category';
		// Добавляем базовый класс (на случай, если он был удален)
		this._category.classList.add('card__category');

		this.setText(this._category, value);
		const categoryClass = cardCategory.get(value);
		if (categoryClass) {
			this._category.classList.add(`card__category_${categoryClass}`);
		}
	}

	get category(): string {
		return this._category?.textContent || '';
	}

	set button(value: string) {
		if (this._button) this.setText(this._button, value);
	}
}
