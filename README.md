# Проектная работа "Веб-ларек" интернет-магазин с товарами для веб-разработчиков — Web-ларёк. В нём можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ. 
Автор: Каспирович Максим Леонидович

Стек: HTML, SCSS, TS, Webpack

## Описание
Проект пишется по архитектуре MVP (Model-View-Presenter)

### `Model`
Model включает в себя работу с загрузкой данных по API, работу с данными, полученными от пользователя

### `View`
View включает в себя отображение интерфейса для взаимодействия пользователя

### `Presenter`
Связывает Model и View при срабатывании событий

## Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Базовый код
## 1. Класс `Components<T>` базовый абстрактный класс для создания компонентов пользовательского интерфейса. Дает возможность для управления DOM элементами и поведением компонентов

### *Свойства*:
    `protected readonly container: HTMLElement` - Корневой DOM-элемент

### *Конструктор*:
    `protected constructor(protected readonly container: HTMLElement)` - принимает элемент контейнера, в который будет помещен компонет

### *Методы*:
    `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключение классов
    `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое
    `setDisabled(element: HTMLElement, state: boolean)` - меняет статус блокировки
    `setHidden(element: HTMLElement)` - скрывает переданный элемент
    `setVisible(element: HTMLElement)` - отображает переданный элемент
    `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с алтернативным текстом(опционально)
    `render(data?: Partial<T>): HTMLElement` - возвращает корневой DOM элемент

## 2. Класс Api базовый класс для отправки и получения запросов от сервера

### *Свойства*:
    `readonly baseUrl: string;` - базовый URL адрес сервера
### protected options: RequestInit; - объект, хранящий заголовки запросов

### *Конструктор*:
    `constructor(baseUrl: string, options: RequestInit = {})` - принимает URL адреса, по которому будут совершаться запросы и общие опции для этих запросов

### *Методы*:
    `handleResponse(response: Response): Promise<object>` - как параметр принимает ответ от сервера и обрабатывает его, возвращая результат в формате JSON или отклоненный Promise с ошибкой
    `get(uri: string)` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает Promise с объектом, который ответил на сервер
    `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект данных, который будет передан в JSON в теле запроса и отправляет эти данные на эндпоинт, переданный в параметрах при вызове метода. По умолчанию отправляется POST запрос, но может быть переопределен третьим параметром на PUT или DELETE

## 3. Класс EventEmitter базовый класс, позволяющий отправлять события и подписываться на события, происходящие в системе, используется для связи слоя данных и представления
```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
EventEmitter имплементируется от IEvents

### *Свойства*:
    `_events: Map<EventName, Set<Subscriber>>` - хранилище подписчиков на события

### *Конструктор*:
    `constructor()` - инициализирует брокер событий

### *Методы*:
    `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - установить обработчик на событие
    `off(eventName: EventName, callback: Subscriber)` - снять обработчик с события
    `emit<T extends object>(eventName: string, data?: T)` - инициировать событие с данными
    `onAll(callback: (event: EmitterEvent) => void)` - слушать все события
    `offAll()` // сбросить все обработчики
    `trigger<T extends object>(eventName: string, context?: Partial<T>)` - сделать коллбек триггер, генерирующий событие при вызове

# Общие классы

## Класс Modal реализует модальные окна. Предоставляет методы для управления состоянием окна и генерации событий(modal:open и modal:close)

### *Свойства*:
    `protected _closeButton: HTMLButtonElement;` - элемент кнопки закрытия модального окна
    `protected _content: HTMLElement;` - элемент с содержимым модального окна

### *Конструктор*:
    `constructor(container: HTMLElement, protected events: IEvents)` - принимает DOM элемент модального окна и брокер события

### *Cеттеры*:
    `content(value: HTMLElement)` - меняет содержимое модального окна

### *Методы*:
    `open()` - открывает модальное окно и эмитит событие(`modal:open`)
    `close()` - закрывает и стирает содержимое модального окна и эмитит событие(`modal:close`)
    `render(data: IModalData)` - рендерит модальное окно с преданным соддержимым и открывает его

## Класс Form реализует общий компонент формы. Предоставляет базовые методы и сеттеры для работы с этображение форм.

### *Свойства*:
    `protected _submit: HTMLButtonElement;` - элемент кнопки для сабмита
    `protected _errors: HTMLElement;` - контейнер с сообщениями ошибок

### *Контейнер*:
    `constructor(protected container: HTMLFormElement, protected events: IEvents)` - ринимает DOM элемент формы и брокер события

### *Сеттеры*:
    `valid(value: boolean)` - отключает кнопку сабмита в зависимости от состояния
    `errors(value: string)` - меняет содержимое компонента с ошибками на переданное

### *Методы*:
    `onInputChange(field: keyof T, value: string)` - эмитит событие(${field}:change) с переданными аргументами
    `render(state: Partial<T> & IFormState)` - рендерит компонент формы, используя переданное состояние

# Компоненты

## Класс AppData отвечает за хранение данных и логику работы с ними

### *Свойства*:
    `items: IProductItem[] = [];` - массив товаров
    `preview: IProductItem | null = null;` - товар, который открыт для подробной информации
    `basket: IBasket = {
        items: [],
        total: 0,
    };` - объект корзины
    `order: IOrderForm = {
        email: '',
        phone: '',
        address: '',
        payment: 'card',
    };` - данные для заказа
    `formErrors: FormErrors = {}` - данные валидации формы

### *Констурктор*:
    `constructor(protected events: IEvents)` - принимает брокер события

### *Методы*:
    `setItems(items: IProductItem[])` - меняет массив товаров на переданный и эмитит событие(`items:change`)
    `setPreview(item: IProductItem)` - меняет превью на переданный товар и эмитит событие(`preview:change`)
    `inBasket(item: IProductItem)` - проверяет наличие товара в корзине
    `addItemToBasket(item: IProductItem)` - добавляет товар в корзине и эмитит событие(`basket:change`)
    `removeItemFromBasket(item: IProductItem)` - удаляет товар из корзины и эмитит событие(`basket:change`)
    `clearBasket` - очистить корзину
    `setPayment(method: PaymentMethod)` - меняет способ оплаты на переданный
    `setOrderField(field: keyof IOrderForm, value: string)` - меняет содержимое переданного поля на полученное значение
    `clearOrder` - очистить данные ввода
    `validateOrderPayment()` - проверяет корректно ли заполнена форма оплаты и адресса
    `validateOrderDelivery()` - проверяет корректно ли заполнена форма с номером телефона и почтой
    `updateFormErrors(errors: FormErrors, eventName: string)` - обновляет ошибки формы и отправляет событие
    `validateEmail(email: string): boolean` - проверка валидности введеного email
    `validatePhone(phone: string): boolean` - проверка валидности введеного номера телефона


## Класс Basket реализует корзину и предоставляет сеттеры для изменения отображения корзины

### *Свойства*: 
    `protected _list: HTMLElement;` - элемент содержимого карзины
    `protected _total: HTMLElement;` - элемент суммы товаров в корзине
    `protected _button: HTMLElement;` - элемент кнопки оформления в корзине

### *Констурктор*:
    `constructor(container: HTMLElement, protected events: EventEmitter)` - принимает DOM элемент корзины и брокер событий

### *Сеттеры*:
    `items(items: HTMLElement[])` - меняет содержимое корзины в зависимости от переданных товаров 
    selected(items: string[]) - управляем состоянием кнопки
    `total(total: number)` - меняет общую сумма на переданное значение

## Класс Card реализует карточку товара

### *Свойства*:
    `protected _descriptions: HTMLElement;` - описание карточки
    `protected _image: HTMLImageElement;` - изображение карточки
    `protected _title: HTMLElement;` - заголовок карточки
    `protected _category: HTMLElement;` - категория карточки
    `protected _price: HTMLElement;` - цена карточки
    `protected _button: HTMLButtonElement;` - кнопка карточки

### *Конструктор*:
    `constructor(container: HTMLElement, actions?: ICardActions)` - принимает DOM элемент карточки и брокер событий

### *Сеттеры*: 
    `set id(value: string)` - принимает и задает айди карточке
    `set title(value: string)` - меняет заголовк на полученный
    `set image(value: string)` - меняет изображение на полученное
    `set description(value: string)` - меняет описание на полученное
    `set price(value: string)` - меняет цену на полученную
    `set category(value: string)` - меняет категорию на полученную
    `set button(value: string)` - устанавливает текст на кнопке

## Класс OrderDelivery реализует компонент формы контактов

### *Конструтор*:
    `constructor(container: HTMLFormElement, events: IEvents)` - принимает DOM элементы формы контактов и брокер событий

### *Сеттеры*:
    `phone(value: string)` - меняет содержимое поля phone
    `email(value: string)` - меняет содержимое поля email

## Класс OrderPayment реализует компоненты формы оплаты и адресса

### *Свойства*:
    `protected _paymentCash: HTMLButtonElement;` - кнопка оплаты при получении
    `protected _paymentCard: HTMLButtonElement;` - кнопка онлайн оплаты

### *Конструтор*:
    `constructor(container: HTMLFormElement, events: IEvents)` - принимает DOM элементы формы оплаты и адресса, и брокер событий

### *Сеттеры*:
    `address(value: string)` - меняет содержимое поля address 
    `payment(value: PaymentMethod)` - меняем кнопки в зависимости от способа оплаты

## Класс Page реализует главную страницу, генерирует событие(basket:open) при клике на корзину

### *Свойства*:
    `protected _counter: HTMLElement;` - элемент счетчика
    `protected _catalog: HTMLElement;` - элемент каталога
    `protected _wrapper: HTMLElement;` - элемент обертки
    `protected _basket: HTMLElement;` - элемент корзины

### *Конструтор*:
    `constructor(container: HTMLElement, protected events: IEvents)` - принимает DOM элемент главной страницы и брокер событий

### *Сеттеры*:
    `counter(value: number)` - меняет содержимое счетчика на полученное
    `catalog(items: HTMLElement[])` - меняет содержимое каталога на полученное
    `locked(value: boolean)` - меняем класс обертки, в зависимости от полученного значения

## Класс Succes реализует окно с подтверждением заказа
    
### *Свойства*:
    `protected _close: HTMLButtonElement;` - элемент кнопки закрытия
    `protected _total: HTMLElement;` - элемент с суммой заказа

### *Конструтор*:
    `constructor(container: HTMLElement, actions: ISuccessActions)` - принимает DOM элемент окна подтверждения заказа и брокер событий

### *Сеттеры*:
    `total(value: number)` - меняет значение общей суммы на переданное

### *Методы*:
    `handleCloseClick = (e: Event)` - закрытие по клику на оверлей
    `handleKeydown = (e: KeyboardEvent)` - закрытие по нажатию Escape
    `destroy()` - отписываемся от событий

## Класс WebLarekApi дополняет базовый класс Api методами работы с конкретным сервером проекта

```
interface IWebLarekApi {
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    createOrder: (order: IOrder) => Promise<IOrderResult>
}
```

 WebLarekApi имплиментируется от IWebLarekApi

### *Свойства*:
    `readonly cdn: string;` - URL сервера с контентом

### *Конструтор*:
    `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - принимает URL сервера с контентом, URL сервера, по которому будут совершаться запросы и общие опции для запросов

### *Методы*:
    `getProductList(): Promise<IProductItem[]>` - возвращает массив карточек с сервера
    `getProductItem(id: string)` - возвращает карточку с сервера по переданному id
    `createOrder(order: IOrder): Promise<IOrderResult>` - отправляет заказ на сервер и возвращает результат

## *Описание событий*:
- `items:change` - изменение массива карточек
- `preview:change` - изменение товара в модальном окне
- `basket:change` - изменение списка товаров в корзине
- `orderFormErrors:change` - изменение списка ошибок валидации формы оплаты
- `contactsFormErrors:change` - изменение списка ошибок валидации формы контактов
- `modal:open` - открытие модальных окон
- `modal:close` - закрытие модальных окон
- `basket:open` - открытие корзины
- `card:select` - выбор карточки
- `order:open` - открытие окна оформления заказа
- `${form}:submit` - отправка формы
- `${form}.${field}:change` - изменение поля в форме

*Добавил в constants cardCategory, который отвечает за цвет категории*