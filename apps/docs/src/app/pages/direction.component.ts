import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-direction',
  imports: [PageComponent, CodeBlockComponent, RouterLink],
  template: `
    <app-page
      title="Right to left"
      lead="Arabic is a first language here, not a translation. Set lang and dir on the page and every component turns around by itself: the kit uses only logical sides (start and end), never left and right."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">The same markup, both ways</h2>
        <div class="doc-direction">
          <div class="doc-card" lang="en" dir="ltr">
            <nav class="ui-breadcrumbs" aria-label="Breadcrumbs, English">
              <ol>
                <li><span>Home</span></li>
                <li><span>Orders</span></li>
                <li><span aria-current="page">Order 1042</span></li>
              </ol>
            </nav>
            <label class="ui-switch">
              <input
                class="ui-switch__input"
                type="checkbox"
                role="switch"
                checked
              />
              Email me
            </label>
          </div>
          <div class="doc-card" lang="ar" dir="rtl">
            <nav class="ui-breadcrumbs" aria-label="مسار الصفحة">
              <ol>
                <li><span>الرئيسية</span></li>
                <li><span>الطلبات</span></li>
                <li><span aria-current="page">الطلب ١٠٤٢</span></li>
              </ol>
            </nav>
            <label class="ui-switch">
              <input
                class="ui-switch__input"
                type="checkbox"
                role="switch"
                checked
              />
              راسلني بالبريد
            </label>
          </div>
        </div>
        <app-code-block [text]="usage" caption="HTML" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What turns, what does not</h2>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="What turns around"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Turns around</th>
                <th scope="col">Stays as is</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Text, padding, borders, the side bar's current bar</td>
                <td>Logos, and code samples (always left to right)</td>
              </tr>
              <tr>
                <td>Arrows that mean back and next (pagination)</td>
                <td>Check marks, the clock, play and pause</td>
              </tr>
              <tr>
                <td>The switch knob, drawers (from the left in Arabic)</td>
                <td>Numbers: 1042 reads left to right in both</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            In your own CSS, write <code>margin-inline-start</code>, not
            <code>margin-left</code>; <code>inset-inline-end</code>, not
            <code>right</code>. Mirror a pointing icon with
            <code>:dir(rtl)</code>.
          </li>
          <li>
            Mark a word in the other language with its own <code>lang</code>, so
            it gets the right face and is read out in the right voice.
          </li>
          <li>
            Arabic is never letter-spaced or slanted into italics; see
            <a routerLink="/foundations/type">Type</a>.
          </li>
          <li>
            Choose one kind of digit per product. Intl.NumberFormat with
            <code>ar-EG</code> writes ١٠٤٢; with <code>ar-EG-u-nu-latn</code>,
            1042.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class DirectionComponent {
  protected readonly usage = `<html lang="ar" dir="rtl">
  …
  <!-- A word in English inside Arabic text -->
  <p>افتح <span lang="en" dir="ltr">Settings</span> من القائمة.</p>
</html>`;
}
