import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/WebLarekApi';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { OrderDelivery } from './components/OrderDelivery';
import { OrderPayment } from './components/OrderPayment';
import { Success } from './components/Success';
import { ensureElement, cloneTemplate } from './utils/utils';
import { AppData } from './components/AppData';
import { IOrderForm, IProductItem } from './types';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPrewievTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppData(events);

// Глобальные контейнеры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderDelivery = new OrderDelivery(
	cloneTemplate(contactsTemplate),
	events
);
const orderPayment = new OrderPayment(cloneTemplate(orderTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		console.log('Closing modal');
		modal.close();
	},
});

//Поймали событие, сделали что нужно

//Блокируем прокрутку страницы, если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

//Разблокируем прокрутку страницы, если открыто модальное окно
events.on('modal:close', () => {
	page.locked = false;
	appData.clearOrder();
});

//Открыть подробное описание выбранной карточки
events.on('card:select', (item: IProductItem) => {
	appData.setPreview(item);
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Измененяем элементы каталога
events.on('items:change', (items: IProductItem[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

// Изменяем открытую выбранную карточку
events.on('preview:change', (item: IProductItem) => {
	const card = new Card(cloneTemplate(cardPrewievTemplate), {
		onClick: () => {
			if (appData.inBasket(item)) {
				appData.removeItemFromBasket(item);
				card.button = 'В корзину';
			} else {
				appData.addItemToBasket(item);
				card.button = 'Удалить из корзины';
			}
		},
	});

	card.button = appData.inBasket(item) ? 'Удалить из корзины' : 'В корзину';
	modal.render({ content: card.render(item) });
});

// Изменились товары в корзине
events.on('basket:change', () => {
	page.counter = appData.basket.items.length;
	basket.items = appData.basket.items.map((id) => {
		const item = appData.items.find((item) => item.id === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeItemFromBasket(item),
		});
		return card.render(item);
	});
	basket.total = appData.basket.total;
});

// Открыть форму оплаты и адреса
events.on('order:open', () => {
	modal.render({
		content: orderPayment.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму заказа
events.on('order:submit', () => {
	modal.render({
		content: orderDelivery.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей в форме оплаты и ввода адреса
events.on(
	/^order\..*:change$/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
		appData.validateOrderPayment();
	}
);

// Изменилось одно из полей в форме контактов
events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
		appData.validateOrderDelivery();
	}
);

//Изменилось состояние валидации формы оплаты и ввода адреса
events.on('orderFormErrors:change', (error: Partial<IOrderForm>) => {
	const { payment, address } = error;
	orderPayment.valid = !payment && !address;
	orderDelivery.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

//Изменилось состояние валидации формы ввода контактов
events.on('contactsFormErrors:change', (error: Partial<IOrderForm>) => {
	const { email, phone } = error;
	orderDelivery.valid = !email && !phone;
	orderDelivery.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//Отправка данных
events.on('contacts:submit', () => {
	api
		.createOrder({ ...appData.order, ...appData.basket })
		.then((data) => {
			modal.render({
				content: success.render(),
			});
			success.total = data.total;
			appData.clearBasket();
			appData.clearOrder();
		})
		.catch(console.error);
});

// Получаем карточки с сервера
api.getProductList()
	.then(
		appData.setItems.bind(appData)
	)
	.catch(console.error);
