export const metadata = {
  title: 'Gov Scanner - Crypto Governance Monitor',
  description: 'Monitor crypto governance forums and active votes across 25+ protocols',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
