import { SKILLS } from "../core/skills";
import type { BlockInfo, Outcome } from "../core/blockEdit";

export interface BlockMenuProps {
  x: number;
  y: number;
  info: BlockInfo;
  onPickSkill: (name: string) => void;
  onPickOutcome: (outcome: Outcome) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function BlockMenu({
  x,
  y,
  info,
  onPickSkill,
  onPickOutcome,
  onClear,
  onClose,
}: BlockMenuProps) {
  const hasFormatting = info.skillCls !== null || info.outcome !== null;
  const unavailableOutcomeMessage = "No [check] bracket on this line";

  return (
    <>
      <div className="dropdown-backdrop" onClick={onClose} />
      <div className="block-menu" style={{ left: x, top: y }}>
        <div className="block-menu-section-label">Check result</div>
        <div className="block-menu-outcomes">
          <OutcomeButton outcome="success" currentOutcome={info.outcome} disabled={!info.hasBracket} title={unavailableOutcomeMessage} onPick={onPickOutcome} />
          <OutcomeButton outcome="failure" currentOutcome={info.outcome} disabled={!info.hasBracket} title={unavailableOutcomeMessage} onPick={onPickOutcome} />
        </div>
        {!info.hasBracket && <div className="block-menu-hint">{unavailableOutcomeMessage}</div>}

        <div className="block-menu-section-label">Skill</div>
        <div className="block-menu-skills">
          {SKILLS.map((skill) => {
            const isCurrent = skill.className === info.skillCls;
            return (
              <button
                key={skill.name}
                className={isCurrent ? "skill-dropdown-item is-current" : "skill-dropdown-item"}
                style={{ color: skill.color }}
                onClick={() => onPickSkill(skill.name)}
              >
                {skill.name}{isCurrent && <span className="skill-current-mark"> {"\u2713"}</span>}
              </button>
            );
          })}
        </div>

        {hasFormatting && <button className="block-menu-clear" onClick={onClear}>Remove formatting</button>}
      </div>
    </>
  );
}

interface OutcomeButtonProps {
  outcome: Outcome;
  currentOutcome: Outcome | null;
  disabled: boolean;
  title: string;
  onPick: (outcome: Outcome) => void;
}

function OutcomeButton({ outcome, currentOutcome, disabled, title, onPick }: OutcomeButtonProps) {
  const isCurrent = currentOutcome === outcome;
  const className = `outcome-btn outcome-${outcome}${isCurrent ? " is-current" : ""}`;

  return (
    <button className={className} disabled={disabled} title={disabled ? title : undefined} onClick={() => onPick(outcome)}>
      {outcome === "success" ? "Success" : "Failure"}
    </button>
  );
}