import type {RecordEntry} from './schema';
// Ephemeral demo storage. Replace with a transactional database before production.
const globalStore=globalThis as unknown as {agentTrustRecords?:Map<string,RecordEntry>};
export const records=globalStore.agentTrustRecords??(globalStore.agentTrustRecords=new Map<string,RecordEntry>());
export function log(r:RecordEntry,type:string,detail:string){r.events.push({at:new Date().toISOString(),type,detail});}
