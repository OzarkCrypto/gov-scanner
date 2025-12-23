export const metadata = {
  title: 'Gov Scanner - DeFi Governance Monitor',
  description: 'Monitor DeFi governance forums for drama and important proposals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
