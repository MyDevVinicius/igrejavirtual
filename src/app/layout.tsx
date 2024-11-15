import "../styles/globals.css";

const RootLayout: React.FC = ({ children }) => {
  return (
    <html lang="pt-BR">
      <head>
        <title>Igreja Virtual</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
