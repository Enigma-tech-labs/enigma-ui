# @enigma-ui/vue

Core Vue 3 controls for the Enigma Technology Lab design system. The package uses Vue's native component APIs and the shared styles from [`@enigma-ui/css`](../css); it does not yet include the full Angular and React component set.

```shell
pnpm add @enigma-ui/vue @enigma-ui/css vue
```

Import the design-system stylesheet once in the app:

```css
@import '@enigma-ui/css/ui.css';
```

```vue
<script setup lang="ts">
import { Button, TextField } from '@enigma-ui/vue';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <form>
    <TextField v-model="email" label="Email" type="email" required />
    <Button type="submit">Continue</Button>
  </form>
</template>
```

Available components: `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `PhoneField`, `Progress`, `RadioGroup`, `Skeleton`, `Spinner`, `Switch`, `TextField`, and `Textarea`. Form controls support `v-model`, native input attributes, labels, hints, and error messages. Pass `dir="rtl"` on an ancestor for right-to-left layouts.

[Docs and source](https://github.com/Enigma-tech-labs/enigma-ui). MIT licence.
