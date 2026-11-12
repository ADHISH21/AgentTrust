import './globals.css';import type {Metadata} from 'next';
export const metadata:Metadata={title:'AgentTrust | Intent Firewall',description:'Human intent, enforced before AI agents pay.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
