import { setWorldConstructor, World as CucumberWorld, IWorldOptions } from '@cucumber/cucumber';

export interface ICustomWorld extends CucumberWorld {
  // Aqui você pode adicionar qualquer dado que queira compartilhar entre os steps
  currentUser?: { id: number; name: string; email: string };
  lastApiResponse?: any;
  // Adicione outras propriedades conforme necessário
}

class CustomWorld extends CucumberWorld implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
export type World = ICustomWorld;
