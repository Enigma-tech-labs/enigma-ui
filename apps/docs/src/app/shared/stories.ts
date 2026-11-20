/**
 * The story each page tells: one scene, one sentence. The hero on every page reads from here,
 * keyed by route path, so the chapter (the side bar group) and the scene always match the nav.
 */
export const STORIES: Record<string, string> = {
  '/getting-started':
    'Monday, 9:00. A blank project, one stylesheet, and a client who wants it in Arabic by Friday.',
  '/ai':
    'Your assistant has never seen this kit. Hand it one file and it writes like it built it.',
  '/accessibility':
    'Same screen, no mouse, no sight, no patience for a missed label. Everyone still gets through.',

  '/foundations/colour':
    'A single blue is chosen at dawn. By dusk it has a dark twin, a hover, and a 7:1 pair.',
  '/foundations/typography':
    'Two scripts, one rhythm. Latin and Arabic line up on the same baseline grid.',
  '/foundations/space':
    'Nothing is placed by eye. Every gap is a step on one ladder, and the ladder is the layout.',
  '/foundations/shadow':
    'Lift a layer and the room changes. Only what floats gets a shadow; the rest stays on the ground.',
  '/foundations/icons':
    'Open the page in Arabic and the arrows turn round on their own. The magnifier stays put.',
  '/foundations/z-index':
    'A toast, a dialog and a menu all want the top. A fixed order settles it before they meet.',
  '/foundations/motion':
    'Movement that explains, then gets out of the way. Switch on reduce-motion and it all goes still.',
  '/foundations/focus':
    'Press Tab. Follow the ring. Wherever you are, you can always tell.',
  '/foundations/layout':
    'One column on a phone, three on a desk. The grid never asks which device you brought.',
  '/foundations/theme':
    'A new client, a green logo, a demo at four. One colour in, a whole theme out, every pair still 7:1.',
  '/foundations/direction':
    'Flip the page and nothing breaks, because nothing was ever pinned to the left.',

  '/components/button':
    'The first thing anyone presses. It has to say what it will do, and mean it.',
  '/components/calendar':
    'Find a free Thursday in a month of busy ones, with a keyboard, in either calendar direction.',
  '/components/checkbox':
    'Tick what applies. Leave the rest. A half-filled box says some of them do.',
  '/components/chip-input':
    'Type, press Enter, and an idea becomes a chip. Backspace takes it back.',
  '/components/combobox':
    'Start typing "Ale" and the city finds you. Or keep going and invent your own.',
  '/components/fieldset':
    'Related questions stand together under one legend, so a screen reader hears the topic once.',
  '/components/file-field':
    'Drop a document in. Watch it arrive, or watch it be politely refused and told why.',
  '/components/radio-group':
    'Many options, exactly one answer. Choose well; the others step back.',
  '/components/rating': 'Five stars, and a way to give them without a mouse.',
  '/components/search-field':
    'Four letters into a thousand orders, and the one you meant is already on top.',
  '/components/segmented-control':
    'Day, week or month. One tap and the whole chart answers.',
  '/components/date-picker':
    'Any day but Friday, and never yesterday. The calendar already knows.',
  '/components/number-field':
    'Two guests, then three. A tap, an arrow key, or the number typed in Arabic.',
  '/components/phone-field':
    'She types 010 out of habit. The form still gets +20, ready to text.',
  '/components/pin-input':
    'The code arrives, the keyboard offers it, and six boxes fill in one tap.',
  '/components/app-shell':
    'Every screen of the app, one frame. On a phone it folds away until you ask.',
  '/components/select':
    'A long list, folded into a single line until you ask for it.',
  '/components/slider':
    'Drag to decide how much, or nudge with arrow keys until it is exactly right.',
  '/components/switch': 'On or off, now. No Save button, no second thoughts.',
  '/components/text-field':
    'Where every form starts. A label that stays put, a hint that helps, an error that explains.',
  '/components/textarea':
    'Room to say it properly. It grows with you and counts what is left.',

  '/components/alert':
    'Something happened, and the page says so in words, not just in colour.',
  '/components/badge':
    'A small label that does a lot of quiet work: new, beta, three unread.',
  '/components/empty-state':
    'An empty page is a chance to point somewhere, not a dead end.',
  '/components/progress':
    'Eight seconds feels like twenty until you can see it move.',
  '/components/skeleton':
    'Before the data lands, the page already knows its own shape.',
  '/components/spinner':
    'When there is nothing to measure, a calm loop that says: still here.',
  '/components/toast':
    'Saved. It tells you once, stays long enough to read, and leaves without a fuss.',

  '/components/breadcrumbs':
    'Four levels deep and not lost: the trail back is always one click away.',
  '/components/command-palette':
    'Ctrl+K, a few letters, and you are anywhere in the product.',
  '/components/language-switcher':
    'One tap turns English into Arabic and the whole page turns with it.',
  '/components/menu':
    'A short list of actions behind a single button, reachable by arrow keys.',
  '/components/nav': 'The map of the site, and a bold "you are here" on it.',
  '/components/pagination':
    'Four hundred rows, twenty at a time, and a clear way to jump to the end.',
  '/components/stepper':
    'A long job cut into steps, so you always know how far you have come.',
  '/components/tabs': 'Four views of one thing, one visible at a time.',

  '/components/alert-dialog':
    'Delete forever? The page stops and asks, once, in plain words.',
  '/components/bottom-sheet':
    'On a phone, the answer rises from the bottom, where your thumb already is.',
  '/components/dialog': 'The page holds its breath while you finish one thing.',
  '/components/drawer':
    'A panel slides in from the edge with the details; the page waits behind it.',
  '/components/popover':
    'A little more, right where you asked for it, then gone.',
  '/components/tooltip': 'Hover, or focus, and an icon explains itself.',

  '/components/accordion':
    'Ten answers, one open at a time. Everything else folds away.',
  '/components/avatar':
    'A face, or initials when there is no face, always the same size and shape.',
  '/components/card':
    'A small stack of related things, bordered and kept flat on the page.',
  '/components/data-table':
    'Rows to sort, rows to select, and a header that stays in view.',
  '/components/timeline':
    'A request moves from desk to desk. Every decision stays on the record.',
  '/components/divider':
    'A thin line that tells the reader a new thought starts here.',
  '/components/stat':
    'One number, one label, one arrow. The whole dashboard in a glance.',
  '/components/tree':
    'Folders inside folders, opened one branch at a time with the arrow keys.',
  '/components/tag': 'A removable label: attach it, filter by it, drop it.',
};

/** Fallback when a page has no scene of its own. */
export const DEFAULT_STORY = 'Built once, read the same in every framework.';
