import {Component, h, Element, Host, Prop, State} from '@stencil/core';

import {OidAuth} from '../types/oid-auth';

import {loadOidAuth} from '../helpers/oid-auth.utils';
import {translate} from '../helpers/translations.utils';

/**
 * @slot - A custom text to be displayed in the button. Per default "sign" translated in de, fr, it or en according browser lang.
 */
@Component({
  tag: 'owlly-sign',
  styleUrl: 'signature.scss',
  shadow: true,
})
export class Signature {
  @Element() el: HTMLElement;

  /**
   * An aria-label for the shadowed button. Per default "sign" translated in de, fr, it or en according browser lang.
   */
  @Prop()
  ariaLabel: string;

  /**
   * IntersectionObserver rootMargin property.
   */
  @Prop()
  observerRootMargin: string = '100px 0px';

  /**
   * IntersectionObserver threshold property.
   */
  @Prop()
  observerThreshold: number | number[];

  @State()
  private oidAuth: OidAuth | undefined;

  private anchor!: HTMLAnchorElement;

  private observer: IntersectionObserver;

  async componentWillLoad() {
    await this.initSignature();
  }

  private async initSignature() {
    if (window && 'IntersectionObserver' in window) {
      await this.deferLoad();
    } else {
      await this.load();
    }
  }

  private async deferLoad() {
    this.observer = new IntersectionObserver(this.onIntersection, {
      rootMargin: this.observerRootMargin,
      threshold: this.observerThreshold,
    });

    this.observer.observe(this.el.shadowRoot.host);
  }

  private onIntersection = async (entries: IntersectionObserverEntry[]) => {
    if (!entries || entries.length <= 0) {
      return;
    }

    await this.handleIntersection(entries[0]);
  };

  private async handleIntersection(entry: IntersectionObserverEntry) {
    if (entry.isIntersecting) {
      if (this.observer) {
        this.observer.disconnect();
      }

      await this.load();
    }
  }

  private async load() {
    this.oidAuth = await loadOidAuth();
  }

  private navigate() {
    if (this.oidAuth === undefined) {
      return;
    }

    if (!this.anchor) {
      return;
    }

    this.anchor.click();
  }

  render() {
    const sign: string = translate('sign');

    return (
      <Host>
        <button disabled={this.oidAuth === undefined} onClick={() => this.navigate()} aria-label={sign}>
          <slot>{sign}</slot>
        </button>
        {this.renderLink()}
      </Host>
    );
  }

  private renderLink() {
    if (this.oidAuth === undefined) {
      return undefined;
    }

    return (
      <a ref={(el) => (this.anchor = el as HTMLAnchorElement)} href={`${this.oidAuth.url}`} target="_blank" rel="noopener noreferrer" aria-hidden="true"></a>
    );
  }
}
