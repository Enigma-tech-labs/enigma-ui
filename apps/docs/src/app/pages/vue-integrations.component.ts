import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-vue-integrations-page',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Vue integrations"
      lead="The Vue package is in preview. Its current core controls use Vue 3's native component APIs and the shared Enigma CSS; the rest of the component set is not available in Vue yet."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Install</h2>
        <app-code-block
          caption="Terminal"
          text="pnpm add @enigma-ui/vue @enigma-ui/css vue"
        />
      </section>
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Load the styles once</h2>
        <app-code-block
          caption="src/main.css"
          text="@import '@enigma-ui/css/ui.css';"
        />
      </section>
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Use a control with v-model</h2>
        <app-code-block [text]="example" />
      </section>
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Available in preview</h2>
        <p>
          Alert, Badge, Button, Card, Checkbox, PhoneField, Progress,
          RadioGroup, Skeleton, Spinner, Switch, TextField, and Textarea.
          Components not listed here remain unavailable in Vue for now.
        </p>
      </section>
    </app-page>
  `,
})
export class VueIntegrationsPageComponent {
  protected readonly example = `<script setup lang="ts">
import { Button, TextField } from '@enigma-ui/vue';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <form>
    <TextField v-model="email" label="Email" type="email" required />
    <Button type="submit">Continue</Button>
  </form>
</template>`;
}
