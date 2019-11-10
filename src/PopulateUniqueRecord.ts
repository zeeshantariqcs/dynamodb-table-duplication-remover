import { NEW_CUSTOMER_PRODUCT_TABLE } from './common/constants';
import { dynamodb } from './common/dynamo';
import { ICustomerProduct } from "./CustomerProduct";


export let insertRecord = (record: ICustomerProduct): Promise<any> {
    return dynamodb.put({
        TableName: NEW_CUSTOMER_PRODUCT_TABLE,
        Item: record
    }).promise();
}

/***
 * @author: Zeeshan Tariq
 * @Purpose: This will insert the data in new table (It won't create new record if the data is not unique means
 * receieving same uid and pid twice because we have created the composite key uid is the hash key
 * and pid is the sort key) In that case it will overwrite the existing data that is fine we don't need to lookup from huge record
 */
export let handler = (event: ICustomerProduct, context): Promise<any> => {
    //Insert the data in new table
    console.log('Inside PopulateUniqueRecord.handler');
    return insertRecord(event).then()
        .then((data) => {
            console.log("Data Inserted Successfully", data);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Data Inserted Successfully!',
                    input: event,
                }),
            };
        }).catch(err => {
            console.log("PopulateUniqueRecord Error", err)
            return {
                statusCode: 500,
                body: JSON.stringify(err),
            };
        });
};
