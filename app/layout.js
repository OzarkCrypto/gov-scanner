export const metadata = {
  title: 'Crypto Governance Monitor',
  description: 'Track governance votes across 25+ protocols',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
