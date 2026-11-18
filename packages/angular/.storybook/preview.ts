import type { Preview } from '@storybook/angular';

// Angular 22 reads this global at bootstrap; Storybook's webpack builder doesn't define it.
(globalThis as { ngServerMode?: boolean }).ngServerMode = false;

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
    dir: {
      description: 'Text direction',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: ['ltr', 'rtl'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', dir: 'ltr' },
  decorators: [
    (story, { globals, parameters }) => {
      const root = document.documentElement;
      root.dataset['theme'] = globals['theme'];
      root.dir = parameters['dir'] ?? globals['dir'];
      root.lang = root.dir === 'rtl' ? 'ar' : 'en';
      return story();
    },
  ],
};

export default preview;
