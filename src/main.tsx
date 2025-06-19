import React from 'react';
import ReactDOM from 'react-dom/client';
import { XMLGeneratorPage } from './pages/XMLGeneratorPage/XMLGeneratorPage';
import { GlobalStyle } from './shared/ui/GlobalStyle';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <GlobalStyle />
      <XMLGeneratorPage />
    </>
  </React.StrictMode>
);
