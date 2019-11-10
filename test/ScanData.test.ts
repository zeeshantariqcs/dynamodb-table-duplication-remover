import { dynamodb } from "../src/common/dynamo";
import { CUSTOMER_PRODUCT_TABLE, NEW_CUSTOMER_PRODUCT_TABLE } from "../src/common/constants";
import { ICustomerProduct } from "../src/CustomerProduct";
import { scanData } from "../src/ScanData";
import faker from 'faker';


describe("# CustomerProductTable Population and Scanning", () => {

    it('should insert the 10 random records into CustomerProductTable table', async () => {
        let promises: Promise<any>[] = [];
        for (let count = 0; count < 10; count++) {
            let data: ICustomerProduct = {
                id: faker.random.alphaNumeric(4), uid: `user_${faker.random.alphaNumeric(4)}`, pid: `prod_${faker.random.alphaNumeric(4)}`,
                productDetails: {
                    name: faker.commerce.productName,
                    image: faker.image.imageUrl
                }
            };
            promises.push(dynamodb
                .put({ TableName: CUSTOMER_PRODUCT_TABLE, Item: data })
                .promise());
        }
        let insertedData = await Promise.all(promises);
        expect(insertedData.length).toEqual(10);
    });

    it('should scan the inserted 10 random records from CustomerProductTable', async () => {
        let scannedResult = await scanData();
        expect(scannedResult.ScannedCount).toEqual(10);
    });
});