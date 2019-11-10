import { dynamodb } from "../src/common/dynamo";
import { CUSTOMER_PRODUCT_TABLE, NEW_CUSTOMER_PRODUCT_TABLE } from "../src/common/constants";
import { ICustomerProduct } from "../src/CustomerProduct";
import { insertRecord } from "../src/PopulateUniqueRecord";
import faker from 'faker';

describe("# NewCustomerProductTable unique record insertion verification", () => {
    it('should insert a new random record into NewCustomerProductTable table', async () => {
        let uid = `user_${faker.random.alphaNumeric(4)}`;
        let pid = `prod_${faker.random.alphaNumeric(4)}`;
        let insertData: ICustomerProduct = {
            uid: uid,
            pid: pid,
            productDetails: {
                name: 'productA',
                image: 'http://wewe.sdoasdosadnsa/psad.png'
            }
        };
        await dynamodb
            .put({ TableName: NEW_CUSTOMER_PRODUCT_TABLE, Item: insertData })
            .promise();

        const { Item } = await dynamodb.get({ TableName: NEW_CUSTOMER_PRODUCT_TABLE, Key: { uid: uid, pid: pid } }).promise();
        expect(Item).toEqual(insertData);
    });

    it('should overwrite the record instead of creating a duplicate record', async () => {
        let uid = `user_${faker.random.alphaNumeric(4)}`;
        let pid = `prod_${faker.random.alphaNumeric(4)}`;
        let insertData: ICustomerProduct = {
            uid: uid,
            pid: pid,
            productDetails: {
                name: 'productA',
                image: 'http://wewe.sdoasdosadnsa/psad.png'
            }
        };
        await dynamodb
            .put({ TableName: NEW_CUSTOMER_PRODUCT_TABLE, Item: insertData })
            .promise();

        //Change the values
        insertData.productDetails = {
            name: 'updatedProductName',
            image: 'http://wewe.sdoasdosadnsa/psad.png'
        };

        //Make a new put request, this will overwrite not make a duplicate entry
        await dynamodb
            .put({ TableName: NEW_CUSTOMER_PRODUCT_TABLE, Item: insertData })
            .promise();

        //As there are 3 dynamodb put calls two will insert new record
        // third will overwrite the second one
        let scannedResults = await dynamodb.scan({
            TableName: NEW_CUSTOMER_PRODUCT_TABLE
        }).promise();
        expect(scannedResults.ScannedCount).toEqual(2);
    });
});