import { attribute, hashKey, table, rangeKey } from '@aws/dynamodb-data-mapper-annotations';
import { CUSTOMER_PRODUCT_TABLE } from './common/Constants';

export interface ICustomerProduct {
    uid: string;
    pid: string;
    id?: string;
    productDetails?: any;
}

@table(CUSTOMER_PRODUCT_TABLE)
export class CustomerProduct {
    @hashKey()
    uid!: string;

    @rangeKey()
    pid!: string;

    @attribute()
    productDetails: any = {};
}