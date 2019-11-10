import AWS from 'aws-sdk';
import { SRV, STAGE, CUSTOMER_PRODUCT_TABLE } from './common/constants';
import { dynamodb } from './common/dynamo';


export let scanData = async (event?) => {
    return dynamodb.scan({
        TableName: CUSTOMER_PRODUCT_TABLE,
        Limit: 100,
        IndexName: 'uid-index',
        ...(event && event.LastKey != null) && {
            ExclusiveStartKey: event.LastKey
        }
    }).promise();
}

/***
 * @author: Zeeshan Tariq
 * @purpose: It will scan the the records from existing table
 * and will insert the unique in the new table (done by another lambda function)
 */
export let handler = async (event, context) => {
    //Let's scan the data from existing table which contains the duplicated record
    try {
        let result = await scanData(event);
        for (let item of result.Items || []) {
            //Invoke another lambda function that will insert the record in case it's unique if it's not it will be overwritten
            let params = {
                FunctionName: [SRV, STAGE, 'PopulateUniqueRecord'].join('-'),
                InvocationType: 'Event',
                Payload: JSON.stringify(item)
            };
            await new AWS.Lambda().invoke(params).promise();
        }
        if (result.LastEvaluatedKey) {
            //Invoke this lambda function again, because we are not done here yet
            let params = {
                FunctionName: [SRV, STAGE, 'ScanCustomerProductsData'].join('-'),
                InvocationType: 'Event',
                Payload: JSON.stringify(event)
            };
            return new AWS.Lambda().invoke(params).promise();
        } else {
            console.log('Done');
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'scanning done successfully!',
                    input: event,
                }),
            };
        }
    } catch (exception) {
        console.log('ScanCustomerProductsData error', exception);
        return {
            statusCode: 500,
            body: JSON.stringify(exception),
        };
    }
};
