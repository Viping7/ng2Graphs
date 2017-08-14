import { Ng2GraphsPage } from './app.po';

describe('ng2-graphs App', () => {
  let page: Ng2GraphsPage;

  beforeEach(() => {
    page = new Ng2GraphsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
