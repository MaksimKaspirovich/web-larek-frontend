import { Component } from './base/components';
import { ensureElement } from '../utils/utils';

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick?: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;
    private actions: ISuccessActions;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this.actions = actions;

        this._close = ensureElement<HTMLButtonElement>(
            '.order-success__close',
            this.container
        );
        this._total = ensureElement<HTMLElement>(
            '.order-success__description',
            this.container
        );

        this._close.addEventListener('click', this.handleCloseClick);
        document.addEventListener('keydown', this.handleKeydown);
    }

    private handleCloseClick = (e: Event) => {
        e.preventDefault();
        this.actions?.onClick?.();
    };

    private handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this.actions?.onClick?.();
        }
    };

    set total(value: number) {
        if (!this._total) return;
        this.setText(this._total, `Списано ${value} синапсов`);
    }

    destroy() {
        this._close?.removeEventListener('click', this.handleCloseClick);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}