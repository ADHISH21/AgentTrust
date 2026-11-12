import type {Policy,Proposal,Verdict} from './schema';
const norm=(s:string)=>s.trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
export function evaluate(policy:Policy,p:Proposal,now=new Date()):Verdict{
 const reasons:string[]=[];let review=false;
 if(new Date(policy.expiresAt).getTime()<=now.getTime())reasons.push('Authorization has expired');
 if(p.currency!==policy.currency)reasons.push('Currency differs from authorization');
 if(Math.round(p.amount*100)>Math.round(policy.maxAmount*100))reasons.push(`Amount $${p.amount.toFixed(2)} exceeds $${policy.maxAmount.toFixed(2)} limit`);
 if(!policy.allowedCategories.some(c=>norm(c)===norm(p.category)))reasons.push(`Category “${p.category}” is not permitted`);
 if(policy.allowedMerchants.length && !policy.allowedMerchants.some(m=>norm(m)===norm(p.merchant)))reasons.push(`Merchant “${p.merchant}” is not approved`);
 if(!p.evidence.trim()){review=true;reasons.push('Independent product evidence not provided — requires human review');}
 if(policy.confidence<0.75){review=true;reasons.push('Intent extraction confidence is insufficient');}
 const hard=reasons.filter(r=>!r.includes('requires human review')&&!r.includes('confidence is insufficient'));
 return {decision:hard.length?'BLOCK':review?'REVIEW':'ALLOW',reasons:reasons.length?reasons:['All policy constraints satisfied'],policyVersion:'1.0'};
}
