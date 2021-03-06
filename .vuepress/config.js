const fs = require('fs');
const { path } = require('@vuepress/shared-utils');
const vuepressUtils = require('@vuepress/shared-utils');
const emojiRegex = require('emoji-regex')();
const quickLinks = require('./quickLinks');

// custom slugify function to extend the default one by stripping out leading emoji
const slugify = (s) => {
  return vuepressUtils.slugify(s)
    .replace(emojiRegex, '')
    .replace(/^(\-)/, '');
}

module.exports = {
  // header properties
  title: 'UBC Launch Pad Documentation',
  description: '📚 The official UBC Launch Pad knowledge base',
  head: [
    ['meta', { property: 'og:image', content: 'https://ubclaunchpad.com/share.jpg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', { src: '/scrollToAnchorHack.js' }],
  ],

  // https://vuepress-theme-yuu.netlify.app/ for dark theme
  // TODO: we should switch if this ever gets merged: https://github.com/vuejs/vuepress/pull/2301
  theme: 'yuu',

  themeConfig: {
    // navbar properties
    logo: 'https://raw.githubusercontent.com/ubclaunchpad/ubclaunchpad.com/master/src/assets/rocket.png',
    nav: [
      { text: 'Handbook', link: '/handbook/' },
      { text: 'Resources', link: '/resources/' },
      {
        text: 'Quick Links',
        items: [
          { text: 'About Us', link: 'https://ubclaunchpad.com' },
          // see `quickLinks.js`
          quickLinks.quickLinkRepositories,
          quickLinks.quickLinkDrive,
          quickLinks.quickLinkMisc,
        ]
      },
    ],
    searchPlaceholder: 'Search...',

    // disable automatically setting hash (`#...`) on URL when scrolling down a page
    // makes it hard to link pages when enabled, since often as soon as you land on a page an
    // awkward anchor will get appended to your link
    activeHeaderLinks: false,

    // see https://vuepress.vuejs.org/theme/default-theme-config.html#multiple-sidebars
    sidebar: {
      // generate grouped sidebars for groups of pages
      '/handbook/onboarding/': [
        'everyone',
        'design',
        'strategy',
        'leads',
      ],
      '/handbook/project-management/': [
        'scope',
        'sprints',
        'repositories',
      ],
      '/handbook/tools/': [
        'slack',
        'github',
        'drive',
        'deployment',
        'analytics',
        'social-media',
        'email',
      ],
      '/resources/groundwork/': [
        'stack-choosing',
        'web',
        'android',
        'ios',
      ],
      // automatically generate a sidebar for each page by default
      '/': 'auto',
    },
    sidebarDepth: 2,
    smoothScroll: true,

    // contribution CTA for each page
    docsRepo: 'ubclaunchpad/docs',
    lastUpdated: true,
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    
    // see theme
    yuu: {
      colorThemes: [],
      disableThemeIgnore: true,
    },
  },

  // markdown features
  markdown: {
    slugify,
    anchor: { permalink: true, permalinkBefore: true, permalinkSymbol: '#', slugify },
  },

  plugins: [
    // fulltext search for site content - https://github.com/ubclaunchpad/vuepress-plugin-fulltext-search
    ['fulltext-search', {
      // functions is provided as a Javascript string, which is then rendered as a dynamic
      // module. Because of this, we cannot really do local imports, so any dependencies
      // are just appended together.
      //
      // See docstrings in the imported files for more details.
      functions: [
        fs.readFileSync(path.resolve(__dirname, 'quickLinks.js')),
        fs.readFileSync(path.resolve(__dirname, 'fulltextSearchFunctions.js')),
      ].join('\n'),
    }],

    // remove trailing .html for example - https://vuepress.github.io/en/plugins/clean-urls
    'vuepress-plugin-clean-urls',

    // link to scroll back to top - https://vuepress.vuejs.org/plugin/official/plugin-back-to-top.html
    '@vuepress/back-to-top',

    // analytics are under team@ubclaunchpad.com, property docs.ubclaunchpad.com
    // dashboard: https://app.usefathom.com/share/oemmhhle/docs.ubclaunchpad.com
    // See https://docs.ubclaunchpad.com/handbook/tools/analytics for more about Fathom
    // See https://github.com/ubclaunchpad/vuepress-plugin-fathom for more about this plugin
    ['@ubclaunchpad/fathom', {
      'fathomURL': 'https://chinchilla.ubclaunchpad.com/script.js',
      'siteID': 'OEMMHHLE',
    }],
  ],
}
