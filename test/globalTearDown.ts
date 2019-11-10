import { stop } from 'dynamodb-local';
import yaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs-extra';
import { dynamo } from "../src/common/dynamo";


export default async () => {
    let files = await fs.readdir(path.join(__dirname, '..', 'config', 'dynamo'));
    let promises = files.map((file) => {
        return fs.readFile(path.join(__dirname, '..', 'config', 'dynamo', file)).then((content) => {
            let params = yaml.load(content.toString()).Properties;
            let { PointInTimeRecoverySpecification, SSESpecification, ...rest } = params;
            return dynamo.deleteTable({ TableName: rest.TableName }).promise().catch((err) => {
                console.log(err);
            });
        });
    });
    await Promise.all(promises).then(() => {
        console.log('DB tables flushed');
    });
    stop(8000);
};