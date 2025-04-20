import { Component } from '../base/components';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	private handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			this.close();
		}
	};

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', (e) => {
			console.log('Close button clicked');
			e.preventDefault();
			this.close();
		});

		this.container.addEventListener('click', (e) => {
			if (e.target === this.container) {
				this.close();
			}
		});
		this._content.addEventListener('click', (e) => e.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this.handleKeyDown);
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		document.removeEventListener('keydown', this.handleKeyDown);
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
