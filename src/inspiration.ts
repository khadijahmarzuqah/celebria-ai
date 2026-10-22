import { formatMoney, type EventInput, type EventType, type Plan } from './domain';

export type InspirationArt = 'mood' | 'decor' | 'table' | 'venue';

export type InspirationCard = {
  id: string;
  category: string;
  title: string;
  description: string;
  art: InspirationArt;
  artLabel: string;
};

const profiles: Record<EventType, {
  theme: string;
  decoration: string;
  food: string;
  place: string;
}> = {
  Wedding: {
    theme: 'A ceremony in soft layers',
    decoration: 'Choose one floral focal point, then echo its colors in the aisle and table details.',
    food: 'A shared regional menu with clearly labelled dietary options',
    place: 'A venue with a calm ceremony focal point and a clear dinner flow',
  },
  Birthday: {
    theme: 'A bright birthday palette',
    decoration: 'Make one playful photo corner, then keep the rest of the room open for conversation.',
    food: 'A relaxed menu with an easy-to-serve cake moment',
    place: 'A place with room for games, cake, and comfortable seating',
  },
  Engagement: {
    theme: 'A little glow for the yes',
    decoration: 'Use warm lighting and a small keepsake display instead of decorating every surface.',
    food: 'A relaxed toast and small plates that leave space for conversation',
    place: 'An intimate venue with a natural spot for a toast and photographs',
  },
  Anniversary: {
    theme: 'A warm evening palette',
    decoration: 'Let one framed memory or flower arrangement lead; keep the table uncluttered.',
    food: 'A shared menu with a favourite dessert and clearly marked options',
    place: 'A comfortable setting where guests can gather around one shared table',
  },
  'College event': {
    theme: 'A bold campus color story',
    decoration: 'Use reusable banners, clear wayfinding, and one photo backdrop in school colors.',
    food: 'Quick-to-serve regional snacks and filling mains with labelled options',
    place: 'A campus venue with clear entry, accessible paths, and space for activities',
  },
  'Family gathering': {
    theme: 'A relaxed palette for everyone',
    decoration: 'Mix borrowed vessels and flexible seating so different generations feel comfortable.',
    food: 'A generous shared menu with dietary needs easy to spot',
    place: 'A welcoming space with accessible seating and an easy serving route',
  },
  'Community celebration': {
    theme: 'A shared palette for all ages',
    decoration: 'Create one clear welcome point with reusable signs and a few repeating details.',
    food: 'A simple menu with clear labels and a smooth queue for guests',
    place: 'A community space with an easy arrival route and room for shared activities',
  },
};

function shorten(value: string, max = 108) {
  const clean = value.trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export function getInspirationCards(event: EventInput, plan: Plan): InspirationCard[] {
  const profile = profiles[event.type];
  const theme = event.theme.trim() || profile.theme;
  const food = event.food.trim() || profile.food;
  const guests = Math.max(1, Number(event.guests) || 1);
  const perGuest = event.budget / guests;
  const budgetHint = event.budget === 0
    ? 'Keep it low-cost with borrowed linens and seasonal details.'
    : `Plan around ${formatMoney(perGuest, event.currency)} per guest across the full budget.`;
  const place = event.city.trim()
    ? `${event.setting} inspiration near ${event.city.trim()}`
    : `${event.setting} inspiration for your gathering`;

  return [
    {
      id: 'theme',
      category: 'Theme inspiration',
      title: profile.theme,
      description: `Build around ${shorten(theme, 48)}, then repeat its palette in one invitation and one table detail.`,
      art: 'mood',
      artLabel: 'A palette study',
    },
    {
      id: 'decor',
      category: 'Decorations',
      title: profile.decoration.split(',')[0],
      description: shorten(`${profile.decoration} ${event.setting === 'Outdoor' ? 'Keep a weather-safe alternative.' : plan.decor[0]}`),
      art: 'decor',
      artLabel: 'A decorated focal point',
    },
    {
      id: 'table',
      category: 'Food & table styling',
      title: profile.food,
      description: shorten(`${food}. For ${guests} guests, leave room for comfortable serving. ${budgetHint}`),
      art: 'table',
      artLabel: 'A shared table setting',
    },
    {
      id: 'venue',
      category: 'Venue inspiration',
      title: profile.place,
      description: shorten(`${place}. Check access, setup time, and a practical weather plan directly with the venue.`),
      art: 'venue',
      artLabel: 'A venue moodboard',
    },
  ];
}
