import React from "react";

type LoginLayoutProps = {
  children: React.ReactNode;
};

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <html lang="pt-BR">
      <head>
        <title>Login - Igreja Virtual</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="flex items-center justify-center h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
};

export default LoginLayout;
