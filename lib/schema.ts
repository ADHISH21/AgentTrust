import { z } from 'zod';
export const PolicySchema=z.object({purpose:z.string().min(3).max(300),maxAmount:z.number().positive().finite(),currency:z.literal('USD'),allowedCategories:z.array(z.string().min(2)).min(1).max(12),allowedMerchants:z.array(z.string()).max(12).default([]),expiresAt:z.string().datetime(),confidence:z.number().min(0).max(1)}).strict();
export type Policy=z.infer<typeof PolicySchema>;
export const ProposalSchema=z.object({item:z.string().min(2).max(160),category:z.string().min(2).max(80),merchant:z.string().min(2).max(120),amount:z.number().positive().finite().max(100000),currency:z.literal('USD'),evidence:z.string().max(600).default('')}).strict();
export type Proposal=z.infer<typeof ProposalSchema>;
export type Decision='ALLOW'|'BLOCK'|'REVIEW';
export type Verdict={decision:Decision;reasons:string[];policyVersion:string};
export type RecordEntry={id:string;createdAt:string;policy:Policy;proposal:Proposal;verdict:Verdict;status:'PENDING'|'BLOCKED'|'REVIEW'|'APPROVED'|'ORDER_CREATED'|'CAPTURED'|'PAYMENT_FAILED';orderId?:string;captureId?:string;approvalAt?:string;events:{at:string;type:string;detail:string}[]};
