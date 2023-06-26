import { createContext } from 'react';

interface ContextProp {
      isMenuOpen: boolean;

      //Metodos
      toggleSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProp);