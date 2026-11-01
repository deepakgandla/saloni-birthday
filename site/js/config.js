/* ==========================================================================
   ✏️  EDIT EVERYTHING HERE
   All names, messages, photos and music live in this one file.
   You never need to touch index.html, the CSS or the other JS files.
   ========================================================================== */

window.SITE_CONFIG = {
  // Her name (used in every greeting)
  name: "Saloni",

  // Browser tab title
  pageTitle: "Happy Birthday, Saloni",

  /* ---------- Opening screen ---------- */
  intro: {
    subtitle: "A little something made just for you...",
    button: "Open Your Surprise 🌸",
  },

  /* ---------- Main greeting ---------- */
  message:
    "I hope this birthday brings you as much joy as you bring to everyone lucky enough to know you. " +
    "I'm really grateful our paths crossed — for the easy conversations, the honesty, and all the laughter along the way. " +
    "Today is all about you, so here's to celebrating the wonderful friend you are.",

  /* ---------- A few good memories ----------
     photo: path to an image inside site/assets/photos/, e.g. "assets/photos/first-day.jpg"
            Leave "" to show the illustrated flower placeholder instead.
     date:  optional small label above the title (leave "" to hide).
     text:  ✏️ replace with your own words.
  */
  storyTitle: "A Few Good Memories",
  story: [
    {
      title: "The day we first met",
      date: "",
      photo: "assets/first-met.jpg",
      text: "Funny how someone goes from a new face to one of your favourite people. Really glad our paths crossed.",
    },
    {
      title: "The conversations and the chaos",
      date: "",
      photo: "assets/conversations.jpg",
      text: "The chats that run far too long, the bad jokes, the little rants — somehow they make ordinary days better.",
    },
    {
      title: "The little moments I'll always remember",
      date: "",
      photo: "assets/moments.jpg",
      text: "Your kindness, your sense of humour, and the way you always show up for the people around you.",
    },
    {
      title: "Here's to the year ahead",
      date: "",
      photo: "assets/year-ahead.jpg",
      text: "More good memories, more wins worth celebrating, and plenty more reasons to laugh together.",
    },
  ],

  /* ---------- Final surprise ---------- */
  final: {
    teaser: "One last thing...",
    tapHint: "tap the flower",
    lines: [
      "Happy Birthday, Saloni 🌸",
      "I'm genuinely lucky to have a friend like you.",
      "Here's to your birthday today,",
      "and to many more celebrations, laughs, and good memories ahead.",
    ],
    signoff: "Have the best year yet... 🌸",
  },

  /* ---------- Music ----------
     Replace the file at site/assets/music/ (or change the path below).
     Music never autoplays on page load. If startOnOpen is true, it begins softly
     when she taps "Open Your Surprise" (a user action). The toggle button is always visible.
  */
  music: {
    src: "assets/music/placeholder.m4a",
    volume: 0.45,
    startOnOpen: true,
  },
};
