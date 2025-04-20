import { IOrder, ISuccessOrder, IProductItem } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IWebLarekApi {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	createOrder: (order: IOrder) => Promise<ISuccessOrder>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get(`/product`).then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string) {
		return this.get(`/product/${id}`).then((item: IProductItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	createOrder(order: IOrder): Promise<ISuccessOrder> {
		return this.post(`/order`, order).then((data: ISuccessOrder) => data);
	}
}
