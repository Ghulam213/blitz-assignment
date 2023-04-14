import BormClient from '@blitznocode/blitz-orm';

import { bormConfig } from './borm.config';
import { schema } from './bromSchema';
import { v4 as uuidv4 } from "uuid";


const bormClient = new BormClient({
  schema,
  config: bormConfig,
});

bormClient.mutate({ $entity: 'frame', title: "Page 1", typeof: "page", children: [], id: uuidv4() }, { noMetadata: true }).then(console.log).catch(console.error)
bormClient.query({ $entity: 'frame' }).then(console.log).catch(console.error)

console.log(bormClient)

export default bormClient;