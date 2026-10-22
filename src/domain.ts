export type EventType = 'Wedding' | 'Birthday' | 'Engagement' | 'Anniversary' | 'College event' | 'Family gathering' | 'Community celebration';
export type Currency = 'INR' | 'USD' | 'GBP' | 'EUR';
export type Priority = 'High' | 'Medium' | 'Low';
export type EventInput = {
  name: string; type: EventType; date: string; city: string; guests: number; budget: number;
  currency: Currency; theme: string; food: string; setting: 'Indoor' | 'Outdoor' | 'Either'; notes: string;
};
export type Allocation = { category: string; amount: number };
export type Expense = { id: string; title: string; amount: number; category: string; date: string; notes: string };
export type Milestone = { id: string; title: string; description: string; date: string; priority: Priority; done: boolean };
export type ChecklistItem = { id: string; title: string; category: string; priority: Priority; dueDate: string; notes: string; contact: string; quote: string; done: boolean; suggestionKey?: string };
export type Plan = { palette: string[]; decor: string[]; food: string[]; activities: string[]; venue: string[]; guests: string[]; priorities: string[]; savings: string[] };
export type CelebrationEvent = EventInput & {
  id: string; createdAt: string; allocations: Allocation[]; expenses: Expense[];
  milestones: Milestone[]; checklist: ChecklistItem[]; plan: Plan;
  savedInspirationIds?: string[];
  dismissedChecklistSuggestionKeys?: string[];
};
export const EVENT_TYPES: EventType[] = ['Wedding', 'Birthday', 'Engagement', 'Anniversary', 'College event', 'Family gathering', 'Community celebration'];
export const CATEGORIES = ['Venue', 'Catering', 'Decor', 'Photography', 'Entertainment', 'Invitations', 'Outfits', 'Transport', 'Other', 'Emergency reserve'];
export const VENDOR_CATEGORIES = ['Venue', 'Catering', 'Decor', 'Photography', 'Entertainment', 'Invitations', 'Outfits', 'Transport', 'Other'];
export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
export const defaultInput: EventInput = { name: '', type: 'Birthday', date: '', city: '', guests: 1, budget: 0, currency: 'INR', theme: '', food: '', setting: 'Either', notes: '' };
export function allocateBudget(total: number, type: EventType): Allocation[] {
  const weights: Record<EventType, number[]> = {
    Wedding:[14,30,12,9,8,3,8,5,3,8], Birthday:[12,28,14,8,10,4,4,5,5,10],
    Engagement:[15,27,14,10,8,3,7,5,3,8], Anniversary:[14,29,13,9,8,3,8,5,3,10],
    'College event':[18,26,10,8,14,5,2,6,3,10], 'Family gathering':[15,35,12,6,7,3,3,8,3,10],
    'Community celebration':[20,28,12,7,12,4,1,7,3,8],
  };
  const w = weights[type], planned = Math.max(0, total);
  let used = 0;
  return CATEGORIES.map((category, i) => {
    const amount = i === CATEGORIES.length - 1 ? planned - used : Math.floor(planned * w[i] / 100 * 100) / 100;
    used += amount;
    return { category, amount };
  });
}
export function adjustAllocation(allocations: Allocation[], index: number, requestedAmount: number, budget: number): Allocation[] {
  const next = allocations.map(item => ({ ...item }));
  if (!next[index]) return next;
  const amount = Math.min(Math.max(0, Number.isFinite(requestedAmount) ? requestedAmount : 0), Math.max(0, budget));
  const delta = amount - next[index].amount;
  next[index].amount = amount;
  if (delta > 0) {
    let remaining = delta;
    for (let i = next.length - 1; i >= 0 && remaining > 0; i--) {
      if (i === index) continue;
      const reduction = Math.min(next[i].amount, remaining);
      next[i].amount -= reduction;
      remaining -= reduction;
    }
  } else if (delta < 0 && next.length > 1) {
    const recipient = index === next.length - 1 ? 0 : next.length - 1;
    next[recipient].amount += -delta;
  }
  return next;
}
export function makePlan(e: EventInput): Plan {
  const type = e.type.toLowerCase(), guests = Number(e.guests) || 0, budget = Number(e.budget) || 0;
  const remainingDays = daysUntil(e.date);
  const colors = e.theme.toLowerCase().includes('lavender') ? ['#8b79a1','#e9d8e5','#e88c77','#f7eee0'] :
    e.theme.toLowerCase().includes('garden') ? ['#819379','#dfd9bd','#edaa91','#f5efe2'] :
    e.theme.toLowerCase().includes('gold') ? ['#594261','#c49d62','#e9c4ad','#f5eee3'] :
    ['#604b70','#d6c2dc','#e9907d','#f3d6bc'];
  const crowd = guests > 120 ? 'For a larger guest list, use RSVP deadlines and a simple seating or zone map.' :
    guests < 20 ? 'With an intimate guest list, handwritten place cards and a shared table can feel especially personal.' :
    'Ask guests to confirm dietary needs with their RSVP; keep a small buffer for late confirmations.';
  const tight = remainingDays < 0 ? 'The celebration date has passed. Use this plan as a reference for any follow-up, and update dates before committing to new plans.' :
    remainingDays < 30 ? 'The date is close: confirm venue, food, and essential helpers first; keep optional details flexible.' :
    'Use the extra lead time to compare written quotes before committing to vendors.';
  const spendPerGuest = guests ? budget / guests : 0;
  const venueSetting = e.setting === 'Outdoor' ? 'Look for a shaded garden, courtyard, or community green with a rain plan.' :
    e.setting === 'Indoor' ? 'Prioritize an accessible indoor hall with good natural light and a clear catering setup.' :
    'Compare an indoor venue with an outdoor option, checking accessibility and a weather backup.';
  const foodIdea = e.food.trim() || (type.includes('wedding') ? 'A plated regional menu or well-managed buffet with vegetarian choices.' :
    type.includes('college') ? 'Easy-to-serve regional snacks, filling mains, and clearly labelled vegetarian options.' :
    'A relaxed shared menu with a small dessert moment and clearly labelled dietary options.');
  return {
    palette: colors,
    decor: [e.theme ? `Let “${e.theme}” guide one focal backdrop and two repeat details; avoid decorating every surface.` : 'Choose one focal area, then repeat two colors in flowers, linens, or signage.', 'Use reusable fabric, borrowed vessels, and warm layered lighting to make the room feel finished.', e.setting === 'Outdoor' ? 'Anchor light decor securely and keep a weather-safe indoor alternative.' : 'Keep pathways, entrances, and accessible seating clear.'],
    food: [foodIdea, e.food ? `Confirm the ${e.food} food preference with the caterer and label dishes clearly.` : 'Collect allergies and food preferences when guests RSVP.', `At ${guests} guests, confirm service style, serving quantities, water, and a small contingency with the caterer.`],
    activities: [type.includes('birthday') ? 'A short toast or memory round, followed by a relaxed cake moment.' : type.includes('wedding') || type.includes('engagement') ? 'A brief welcome, one meaningful ritual, and generous time for conversation.' : 'A warm welcome, one shared activity, and an unhurried moment for photos.', guests > 60 ? 'Use a simple run-of-show and identify one person to cue transitions.' : 'Invite a trusted friend to keep the key moments moving gently.'],
    venue: [venueSetting, e.city ? `Explore community halls and independent venues around ${e.city}; verify access, setup window, and written terms directly.` : 'Shortlist nearby community spaces and independent venues; verify access, setup window, and written terms directly.', `At roughly ${formatMoney(spendPerGuest, e.currency)} per guest across the full budget, compare quotes against your complete plan—not venue price alone.`],
    guests: [crowd, 'Share a single source of truth for date, location, arrival time, and travel details.', e.city ? `Include local travel and parking or transit guidance for guests coming to ${e.city}.` : 'Add a clear map pin, parking or transit guidance, and an arrival time to invitations.', ...(e.notes.trim() ? [`Keep this planning note visible to the host: ${e.notes.trim().slice(0, 140)}${e.notes.trim().length > 140 ? '…' : ''}`] : [])],
    priorities: [tight, 'Get written scope, cancellation terms, and payment dates for each vendor before booking.', 'Name one day-of point person so the host can enjoy the gathering.'],
    savings: [budget === 0 ? 'With a zero planned budget, begin with a potluck, borrowed space, shared playlists, and volunteer help—track commitments before spending.' : 'Protect a 7–10% reserve; reduce guest count or simplify one high-cost element before cutting accessibility or food needs.', 'Choose seasonal, local food and reusable decor; compare at least two written quotes.', 'Send digital invitations and ask family or friends to contribute a specific skill only if they are happy to.'],
  };
}
export function makeChecklistSuggestions(e: EventInput): ChecklistItem[] {
  const guestCount = Math.max(1, Number(e.guests) || 1);
  const budget = Math.max(0, Number(e.budget) || 0);
  const remainingDays = daysUntil(e.date);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const dueAt = (fraction: number) => {
    if (remainingDays < 0) return formatDateInput(today);
    const daysToSchedule = Math.max(0, remainingDays - 1);
    const daysFromToday = Math.min(daysToSchedule, Math.floor(daysToSchedule * fraction));
    return formatDateInput(addDays(today, daysFromToday));
  };
  if (remainingDays < 0) {
    return [{
      id: 'suggested:post-event-wrap',
      suggestionKey: 'post-event-wrap',
      title: 'Close out shared costs and thank your helpers',
      category: 'Other',
      priority: 'Low',
      dueDate: formatDateInput(today),
      notes: `For ${e.name || e.type}${e.city ? ` in ${e.city}` : ''}, gather final receipts, return anything borrowed, and send a thank-you.`,
      contact: '',
      quote: '',
      done: false,
    }];
  }

  const food = e.food.trim() || 'your chosen menu and dietary needs';
  const theme = e.theme.trim() || 'the feeling you want guests to remember';
  const setting = e.setting === 'Either' ? 'your indoor or outdoor space' : `your ${e.setting.toLowerCase()} space`;
  const city = e.city.trim() ? ` around ${e.city.trim()}` : '';
  const perGuest = budget / guestCount;
  const budgetNote = budget > 0
    ? `Use ${formatMoney(budget, e.currency)} as the total ceiling (${formatMoney(perGuest, e.currency)} per guest), and keep 7–10% available for surprises.`
    : 'Set a comfortable total before confirming any paid commitments; keep a small reserve for surprises.';
  const organizerNote = e.notes.trim()
    ? ` Keep this in view: ${e.notes.trim().slice(0, 120)}${e.notes.trim().length > 120 ? '…' : ''}`
    : '';
  const runOfShow: Record<EventType, string> = {
    Wedding: 'Confirm the ceremony order, key helpers, and a quiet moment for the couple.',
    Birthday: 'Pick the toast, cake moment, and one person to cue them.',
    Engagement: 'Plan a short toast, a photo moment, and who will welcome guests.',
    Anniversary: 'Choose one shared memory or toast and the person who will introduce it.',
    'College event': 'Write a short run-of-show and assign a lead for wayfinding and transitions.',
    'Family gathering': 'Agree on a flexible serving order and who can help guests settle in.',
    'Community celebration': 'Assign a welcome lead and make the activity schedule easy to find.',
  };
  const tasks: Array<Pick<ChecklistItem, 'suggestionKey' | 'title' | 'category' | 'priority' | 'notes'>> = [
    {
      suggestionKey: 'budget-reserve',
      title: 'Set the budget ceiling and reserve',
      category: 'Other',
      priority: 'High',
      notes: budgetNote,
    },
    {
      suggestionKey: 'venue-setup',
      title: 'Confirm access, setup time, and a weather backup',
      category: 'Venue',
      priority: 'High',
      notes: `Check arrival, accessible paths, seating, and setup details for ${setting}${city}.${organizerNote}`,
    },
    {
      suggestionKey: 'guest-needs',
      title: 'Set an RSVP deadline and collect guest needs',
      category: 'Invitations',
      priority: 'High',
      notes: `Plan for ${guestCount} guests. Ask about dietary and accessibility needs${e.city ? `, and include arrival guidance for ${e.city.trim()}` : ''}.${organizerNote}`,
    },
    {
      suggestionKey: 'menu-quantity',
      title: 'Confirm menu, serving flow, and quantities',
      category: 'Catering',
      priority: 'High',
      notes: `Discuss ${food} for ${guestCount} guests; label dietary options and compare the quote with ${budget > 0 ? `${formatMoney(perGuest, e.currency)} per guest` : 'your agreed budget'}.`,
    },
    {
      suggestionKey: 'visual-anchor',
      title: 'Choose one focal detail for the celebration',
      category: 'Decor',
      priority: 'Medium',
      notes: `Use “${theme}” for one focal point and repeat it in two smaller details. Keep pathways clear and choose weather-safe decor for an outdoor setup.`,
    },
    {
      suggestionKey: 'arrival-info',
      title: 'Share arrival and local travel details',
      category: 'Transport',
      priority: 'Medium',
      notes: e.city.trim()
        ? `Send a map pin for ${e.city.trim()} with parking or transit notes and the arrival time.`
        : `Add a map pin, parking or transit notes, and the arrival time to the invitation.`,
    },
    {
      suggestionKey: 'event-moment',
      title: 'Plan the moment guests will remember',
      category: 'Other',
      priority: 'Medium',
      notes: runOfShow[e.type],
    },
  ];
  return tasks.map((task, index) => ({
    id: `suggested:${task.suggestionKey}`,
    ...task,
    dueDate: dueAt((index + 1) / (tasks.length + 1)),
    contact: '',
    quote: '',
    done: false,
  }));
}
export function refreshChecklistSuggestions(e: EventInput, existing: ChecklistItem[], dismissedKeys: string[] = []): ChecklistItem[] {
  const suggestions = makeChecklistSuggestions(e).filter(item => !item.suggestionKey || !dismissedKeys.includes(item.suggestionKey));
  const suggestionKeys = new Set(suggestions.map(item => item.suggestionKey).filter((key): key is string => Boolean(key)));
  const existingSuggestions = new Map(existing.filter(item => item.suggestionKey).map(item => [item.suggestionKey as string, item]));
  const customItems = existing.filter(item => !item.suggestionKey);
  const customTitles = new Set(customItems.map(item => item.title.trim().toLowerCase()));
  const refreshed = suggestions
    .filter(item => existingSuggestions.has(item.suggestionKey!) || !customTitles.has(item.title.trim().toLowerCase()))
    .map(item => {
      const previous = existingSuggestions.get(item.suggestionKey!);
      return previous ? { ...item, id: previous.id, done: previous.done } : item;
    });
  const retired = existing
    .filter(item => item.suggestionKey && !suggestionKeys.has(item.suggestionKey) && !dismissedKeys.includes(item.suggestionKey))
    .map(item => ({ ...item, suggestionKey: undefined }));
  return [...refreshed, ...customItems, ...retired];
}
export function makeMilestones(e: EventInput): Milestone[] {
  const target = dateOrToday(e.date);
  const today = new Date(); today.setHours(0,0,0,0);
  const guestCount = Math.max(1, Number(e.guests) || 1);
  const location = `${e.setting === 'Either' ? 'indoor or outdoor' : e.setting.toLowerCase()}${e.city.trim() ? ` options around ${e.city.trim()}` : ' space'}`;
  const menu = e.food.trim() || 'the menu and dietary options';
  const theme = e.theme.trim() || 'your chosen theme or feeling';
  const perGuest = Math.max(0, Number(e.budget) || 0) / guestCount;
  const budgetCue = e.budget > 0
    ? ` Compare quotes with ${formatMoney(e.budget, e.currency)} total (${formatMoney(perGuest, e.currency)} per guest).`
    : ' Set a comfortable budget ceiling before confirming paid commitments.';
  const organizerNote = e.notes.trim()
    ? ` Keep this in view: ${e.notes.trim().slice(0, 100)}${e.notes.trim().length > 100 ? '…' : ''}`
    : '';
  const moment: Record<EventType, string> = {
    Wedding: 'the ceremony order and a quiet moment for the couple',
    Birthday: 'the toast and cake moment',
    Engagement: 'the welcome, toast, and photo moment',
    Anniversary: 'the shared memory or toast',
    'College event': 'the run-of-show, activity transitions, and wayfinding',
    'Family gathering': 'a flexible serving order and comfortable seating',
    'Community celebration': 'a clear welcome point and shared activity schedule',
  };
  const defs = [
    { offset:-90,title:'Shape the celebration',description:`Set priorities for ${e.name || e.type}, plan for ${guestCount} guests, and shortlist ${location}.${budgetCue}${organizerNote}`,priority:'High' as Priority },
    { offset:-60,title:'Confirm venue and key vendors',description:`Review written terms, accessibility, setup time, and payment dates for ${location}.${organizerNote}`,priority:'High' as Priority },
    { offset:-35,title:'Send invitations and track replies',description:`Share the location${e.city.trim() ? ` in ${e.city.trim()}` : ''}, arrival time, RSVP date, and a request for food or access needs from ${guestCount} guests.`,priority:'High' as Priority },
    { offset:-21,title:'Confirm food and decor details',description:`Confirm ${menu}, quantities, and how “${theme}” will appear in a few reusable details; keep an outdoor backup if needed.${budgetCue}`,priority:'Medium' as Priority },
    { offset:-7,title:'Final confirmations',description:`Reconfirm arrival windows, guest count, contact notes, and ${moment[e.type]}.${organizerNote}`,priority:'High' as Priority },
    { offset:0,title:'Celebration day',description:`Keep the schedule visible, delegate small decisions, and make space for ${moment[e.type]}.`,priority:'High' as Priority },
    { offset:1,title:'Close the loop',description:'Return borrowed items, settle agreed balances, and share a thank-you.',priority:'Low' as Priority },
  ];
  return defs.map((d, i) => {
   let dt = addDays(target, d.offset);
   // When an event is close, overdue preparation work becomes due today.
   // Never push pre-event deadlines past the celebration date.
   if (target >= today && i < 5 && dt < today) dt = new Date(today);
    return { id:uid(),title:d.title,description:d.description,date:formatDateInput(dt),priority:d.priority,done:false };
  });
}
export function daysUntil(date: string): number {
  if (!date || !Number.isFinite(new Date(`${date}T12:00:00`).getTime())) return 0;
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(`${date}T12:00:00`).getTime() - today.getTime()) / 86400000);
}
export function isValidDateInput(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year,month,day]=date.split('-').map(Number);
  const check=new Date(year,month-1,day);
  return check.getFullYear()===year&&check.getMonth()===month-1&&check.getDate()===day;
}
export function dateOrToday(s: string): Date {
  const d = s ? new Date(`${s}T12:00:00`) : new Date();
  return Number.isFinite(d.getTime()) ? d : new Date();
}
function addDays(date: Date, n: number) { const x = new Date(date); x.setDate(x.getDate()+n); return x; }
function formatDateInput(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  if (!date || !Number.isFinite(new Date(`${date}T12:00:00`).getTime())) return 'Date to be set';
  return new Intl.DateTimeFormat(undefined, options || { day:'numeric',month:'short',year:'numeric' }).format(new Date(`${date}T12:00:00`));
}
export function formatMoney(value: number, currency: Currency) {
  try { return new Intl.NumberFormat(undefined,{style:'currency',currency,maximumFractionDigits:2}).format(Number.isFinite(value)?value:0); }
  catch { return `${currency} ${Math.round(Number(value)||0).toLocaleString()}`; }
}
export function eventProgress(e: CelebrationEvent) {
  const total = e.checklist.length;
  return total ? Math.round(e.checklist.filter(i=>i.done).length / total * 100) : 0;
}
export function makeEvent(input: EventInput): CelebrationEvent {
  return { ...input, id:uid(),createdAt:new Date().toISOString(),allocations:allocateBudget(input.budget,input.type),expenses:[],milestones:makeMilestones(input),checklist:makeChecklistSuggestions(input),plan:makePlan(input) };
}
