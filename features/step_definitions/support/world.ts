import { setWorldConstructor, World as CucumberWorld, IWorldOptions } from '@cucumber/cucumber';

export interface ICustomWorld extends CucumberWorld {
  currentUser?: { id: number; name: string; email: string };
  lastApiResponse?: any;
}

class CustomWorld extends CucumberWorld implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);