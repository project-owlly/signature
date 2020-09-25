import {newSpecPage} from '@stencil/core/testing';

// @ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  // @ts-ignore
  constructor(private func, private options) {}

  observe(element: HTMLElement) {
    this.func([{isIntersecting: true, target: element}]);
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};

import {OidAuth} from '../types/oid-auth';

const oidAuthMock: OidAuth = {
  url:
    'https://eid.sh.ch/authorize?client_id=owllyApp&scope=openid%20given_name%20family_name%20birth_date%20street_address%20postal_code%20locality%20verified_simple&response_type=code&redirect_uri=https%3A%2F%2Fowlly.ch%2Freturn',
  token: 'testtoken',
};

jest.mock('../helpers/oid-auth.utils', () => ({
  loadOidAuth: async (): Promise<OidAuth | undefined> => {
    return oidAuthMock;
  },
}));

import {Signature} from './signature';

describe('signature', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [Signature],
      html: '<owlly-sign></owlly-sign>',
    });

    expect(root).toEqualHtml(`
      <owlly-sign>
        <mock:shadow-root>
          <button aria-label="sign">
            <slot>sign</slot>
          </button>
          <a aria-hidden="true" href="${oidAuthMock.url}" rel="noopener noreferrer" target="_blank"></a>
        </mock:shadow-root>
      </owlly-sign>
    `);
  });

  it('renders with custom slot text', async () => {
    const {root} = await newSpecPage({
      components: [Signature],
      html: '<owlly-sign>Hello World</owlly-sign>',
    });
    expect(root).toEqualHtml(`
      <owlly-sign>
        <mock:shadow-root>
          <button aria-label="sign">
            <slot>sign</slot>
          </button>
          <a aria-hidden="true" href="${oidAuthMock.url}" rel="noopener noreferrer" target="_blank"></a>
        </mock:shadow-root>
        Hello World
      </e-collecting>
    `);
  });

  it('renders with custom aria label', async () => {
    const {root} = await newSpecPage({
      components: [Signature],
      html: '<owlly-sign aria-label="Hello World"></owlly-sign>',
    });
    expect(root).toEqualHtml(`
      <owlly-sign aria-label="Hello World">
        <mock:shadow-root>
          <button aria-label="Hello World">
            <slot>sign</slot>
          </button>
          <a aria-hidden="true" href="${oidAuthMock.url}" rel="noopener noreferrer" target="_blank"></a>
        </mock:shadow-root>
      </e-collecting>
    `);
  });
});
