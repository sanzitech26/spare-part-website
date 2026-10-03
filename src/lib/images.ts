// Free-to-use photos from Unsplash (Unsplash License: free for commercial use, no attribution required).
// Hotlinked from images.unsplash.com; swap for the client's own photography whenever they have it.
const u = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;

export const img = {
  hero: u("1618843479313-40f8afb4b4d8", 1800),        // grey AMG GT, 3/4 front
  headlight: u("1617814076231-2c58846db944", 700),    // LED headlight close-up
  taillight: u("1596321687344-547d323f094a", 700),    // rear, tail light
  grille: u("1599912027765-a69c78bfa3aa", 700),       // AMG panamericana grille
  interior: u("1612368812851-5f7baf8c0d1d", 700),     // cockpit / steering wheel
  emblem: u("1619551734325-81aaf323686c", 1600),      // star emblem on bonnet
  frontDark: u("1592309905620-e5b59f6dcb98", 1600),   // dark front end, headlight
};
