import {newE2EPage} from '@stencil/core/testing';

describe('signature', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<owlly-sign></owlly-sign>');
    const element = await page.find('owlly-sign');
    expect(element).toHaveClass('hydrated');
  });

  it('renders custom text', async () => {
    const page = await newE2EPage();

    await page.setContent('<owlly-sign>Hello World</owlly-sign>');
    const component = await page.find('owlly-sign');
    expect(component.textContent).toEqual(`Hello World`);
  });

  it('should translate', async () => {
    const page = await newE2EPage();

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'language', {
        get: function () {
          return 'de-CH';
        },
      });
      Object.defineProperty(navigator, 'languages', {
        get: function () {
          return ['de-CH', 'de'];
        },
      });
    });

    await page.setContent('<owlly-sign></owlly-sign>');
    const component = await page.find('owlly-sign >>> button');

    expect(component.textContent).toEqual(`unterschreiben`);
  });
});
