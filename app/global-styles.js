import { createGlobalStyle } from 'styled-components';
import Yekan from './assets/fonts/Yekan.ttf';
import Titr from './assets/fonts/BTitr.ttf';
import Nazanin from './assets/fonts/BNazanin.ttf';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    width: 100%;
  }

  body {
    font-family: 'Yekan','Nazanin';
  }

  body.fontLoaded {
    font-family: 'Yekan','Nazanin';
  }

  #app {
    background-color: #fafafa;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Yekan','Nazanin';
    line-height: 1.5em;
  }

  @font-face {
    font-family: 'Titr';
    src: url('${Titr}') format('truetype');
  }

  @font-face {
    font-family: 'Yekan';
    src: url('${Yekan}') format('truetype');
  }
  @font-face {
    font-family: 'Nazanin';
    src: url('${Nazanin}') format('truetype');
  }
`;

export default GlobalStyle;
