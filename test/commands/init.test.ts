/*
 * Copyright 2022 Fernando Boucquez
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'mocha';
import { join } from 'path';
import { FileSystemService, LoggerFactory, LogType } from 'symbol-bootstrap';
import { InitService } from '../../src';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TestUtils } from '../services/TestUtils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { StdUtils } from './StdUtils';

const logger = LoggerFactory.getLogger(LogType.Silent);
const fileSystemService = new FileSystemService(logger);

describe('Init', () => {
    async function generateInit(name: string) {
        const target = `target/${name}`;
        await fileSystemService.deleteFolder(target);
        await fileSystemService.mkdir(target);
        await new InitService(logger, target, {
            ready: true,
            showPrivateKeys: true,
            noPassword: true,
            additionalNetworkPreset: {
                reportBootstrapVersion: '1.1.0',
                peersP2PListLimit: 10000,
                peersApiListLimit: 10000,
                restDeploymentToolVersion: '1.0.8',
                restDeploymentToolLastUpdatedDate: '2021-07-05',
            },
        }).execute();
        const fromExpectedFolder = join('test', 'networkExamples', name, 'input');
        await TestUtils.compareDirectories(logger, fromExpectedFolder, target);
    }

    it('network2 init', async () => {
        // Given this prompts
        StdUtils.in([
            '\n',
            '\n',
            'mytest.com\n',
            'testprefix\n',
            '\n',
            StdUtils.keys.down,
            '\n',
            'My Private Test Network\n',
            `${TestUtils.toKey('A')}`,
            '\n',
            '1626575785\n',
            'pirate\n',
            'gold\n',
            `${TestUtils.toKey('B')}`,
            '\n',
            `${TestUtils.toKey('C')}`,
            '\n',
            'Y\n',
            `${TestUtils.toKey('D')}`,
            '\n',
            '\n',
            `${TestUtils.toKey('E')}\n`,
            `${TestUtils.toKey('F')}\n`,
            `${TestUtils.toKey('AA')}\n`,
            //First node
            `\n`,
            '2',
            `\n`,
            `\n`,
            `\n`,
            `Y\n`,
            `Y\n`,
            //Second node
            StdUtils.keys.down,
            StdUtils.keys.down,
            StdUtils.keys.down,
            StdUtils.keys.down,
            StdUtils.keys.down,
            `\n`,
            '1',
            `\n`,
            `\n`,
            `\n`,
            `\n`,
            `Y\n`,
            `N\n`, //finish
        ]);
        // run and expect generated
        await generateInit('network2');
    });
});
