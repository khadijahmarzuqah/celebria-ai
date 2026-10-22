import { Check, Plus, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { CelebrationEvent } from '../domain';
import { getInspirationCards, type InspirationCard } from '../inspiration';
import { applyCardTilt, resetCardTilt } from '../motion';

type Props = {
  event: CelebrationEvent;
  onToggleSave: (id: string) => void;
};

function ArtPanel({ card, event }: { card: InspirationCard; event: CelebrationEvent }) {
  const style = {
    '--art-one': event.plan.palette[0] ?? '#604b70',
    '--art-two': event.plan.palette[1] ?? '#d6c2dc',
    '--art-three': event.plan.palette[2] ?? '#e9907d',
    '--art-four': event.plan.palette[3] ?? '#f3d6bc',
  } as CSSProperties;

  return (
    <div
      className={`inspiration-art art-${card.art} occasion-${event.type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      style={style}
      role="img"
      aria-label={`${card.artLabel}, illustrated from your event palette`}
    >
      <span className="art-sun" />
      <span className="art-backdrop" />
      <span className="art-object-one" />
      <span className="art-object-two" />
      <span className="art-object-three" />
      <span className="art-object-four" />
      <span className="art-ribbon" />
      <span className="art-label">{card.artLabel}</span>
    </div>
  );
}

export function InspirationGallery({ event, onToggleSave }: Props) {
  const cards = getInspirationCards(event, event.plan);
  const savedIds = event.savedInspirationIds ?? [];

  return (
    <section className="panel inspiration-panel" aria-labelledby="inspiration-title">
      <div className="inspiration-heading">
        <div>
          <div className="eyebrow">A visual starting point</div>
          <h2 id="inspiration-title">Ideas you can make your own</h2>
          <p>Four event-specific directions shaped by your theme, guests, budget, and setting.</p>
        </div>
        <span className="saved-count" aria-live="polite">
          <Sparkles size={15} />
          {savedIds.length ? `${savedIds.length} saved to your plan` : 'Illustrated for your celebration'}
        </span>
      </div>

      <div className="illustration-note">Original CSS illustrations · not venue or vendor photographs</div>

      <div className="inspiration-grid">
        {cards.map((card, index) => {
          const saved = savedIds.includes(card.id);
          return (
            <article
              className="inspiration-card reveal-up"
              key={card.id}
              style={{ animationDelay: `${index * 75}ms` }}
              onPointerMove={applyCardTilt}
              onPointerLeave={resetCardTilt}
            >
              <ArtPanel card={card} event={event} />
              <div className="inspiration-copy">
                <span className="inspiration-category">{card.category}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <button
                  className={`button small inspiration-save ${saved ? 'soft' : 'outline'}`}
                  type="button"
                  aria-pressed={saved}
                  data-testid={`button-save-inspiration-${card.id}`}
                  onClick={() => onToggleSave(card.id)}
                >
                  {saved ? <Check size={15} /> : <Plus size={15} />}
                  {saved ? 'Added to my plan' : 'Add to my plan'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
