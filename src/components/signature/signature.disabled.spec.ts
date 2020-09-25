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

jest.mock('../helpers/oid-auth.utils', () => ({
  loadOidAuth: async (): Promise<OidAuth | undefined> => {
    return undefined;
  },
}));

import {Signature} from './signature';

describe('signature', () => {
  it('should be disabled', async () => {
    const {root} = await newSpecPage({
      components: [Signature],
      html: '<owlly-sign></owlly-sign>',
    });
    expect(root).toEqualHtml(`
      <owlly-sign>
        <mock:shadow-root>
          <button aria-label="sign" disabled="">
            <slot>sign</slot>
          </button>
        </mock:shadow-root>
      </e-collecting>
    `);
  });
});
