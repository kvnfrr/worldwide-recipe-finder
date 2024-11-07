export const metadata = {
  title: 'Recipe Browser',
  description: 'Explore recipes from around the world.',
};

import '../app/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
