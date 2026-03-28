import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Cathode Ray Experiment',
    description: 'Virtual lab simulation of the cathode ray experiment',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased bg-black text-white selection:bg-cyan-500/30">
                {children}
            </body>
        </html>
    );
}
