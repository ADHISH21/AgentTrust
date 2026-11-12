import {NextRequest,NextResponse} from 'next/server';
export function gate(req:NextRequest){const secret=process.env.DEMO_ACCESS_KEY;if(!secret)return null;return req.headers.get('x-demo-key')===secret?null:NextResponse.json({error:'Invalid demo access key'},{status:401});}
export function failure(error:unknown){return NextResponse.json({error:error instanceof Error?error.message:'Unexpected error'},{status:400});}
