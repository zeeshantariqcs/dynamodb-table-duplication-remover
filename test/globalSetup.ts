//ASSIGN TEST ENV PARAMS
let env = {
    'DB_URL': 'http://localhost:8000',
    'AWS_REGION': 'local',
    'AWS_ACCESS_KEY_ID': 'fake-access',
    'AWS_SECRET_ACCESS_KEY': 'fake-secret'
};
Object.assign(process.env, env);

import { launch, stop } from 'dynamodb-local';
import yaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs-extra';
import { dynamo } from "../src/common/dynamo";


export default async () => {
    await launch(8000, null, [], false).then(() => {
        console.log('DyanmoDB running on 8000');
    });
    let files = await fs.readdir(path.join(__dirname, '..', 'config', 'dynamo'));
    let promises = files.map((file) => {
        return fs.readFile(path.join(__dirname, '..', 'config', 'dynamo', file)).then((content) => {
            let params = yaml.load(content.toString()).Properties;
            let { PointInTimeRecoverySpecification, SSESpecification, ...rest } = params;
            return dynamo.createTable(rest).promise().catch((err) => {
                console.log(err);
            });
        });
    });
    await Promise.all(promises).then(() => {
        console.log('DB tables created');
    });
};