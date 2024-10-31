export const metadata = {
  title: 'Recipe Browser',
  description: 'Explore recipes from around the world.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/globals.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
