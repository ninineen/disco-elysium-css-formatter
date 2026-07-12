const ESPRIT_DE_CORPS = "ESPRIT DE CORPS";
const HALF_LIGHT = "HALF-LIGHT";
const HAND_EYE_COORDINATION = "HAND/EYE COORDINATION";

export const SKILLS = [
  { name: "LOGIC", className: "logic", color: "#2A7B9B" },
  { name: "ENCYCLOPEDIA", className: "encyclopedia", color: "#3B888C" },
  { name: "RHETORIC", className: "rhetoric", color: "#1E88E5" },
  { name: "DRAMA", className: "drama", color: "#5C6BC0" },
  { name: "CONCEPTUALIZATION", className: "conceptualization", color: "#0097A7" },
  { name: "VISUAL CALCULUS", className: "visual-calculus", color: "#4682B4" },
  { name: "VOLITION", className: "volition", color: "#8E24AA" },
  { name: "INLAND EMPIRE", className: "inland-empire", color: "#7B1FA2" },
  { name: "EMPATHY", className: "empathy", color: "#9C27B0" },
  { name: "AUTHORITY", className: "authority", color: "#6A1B9A" },
  { name: ESPRIT_DE_CORPS, className: "esprit-de-corps", color: "#5E35B1" },
  { name: "SUGGESTION", className: "suggestion", color: "#AB47BC" },
  { name: "ENDURANCE", className: "endurance", color: "#C62828" },
  { name: "PAIN THRESHOLD", className: "pain-threshold", color: "#D84315" },
  { name: "PHYSICAL INSTRUMENT", className: "physical-instrument", color: "#A1522E" },
  { name: "ELECTROCHEMISTRY", className: "electrochemistry", color: "#C2185B" },
  { name: "SHIVERS", className: "shivers", color: "#9E334D" },
  { name: HALF_LIGHT, className: "half-light", color: "#D32F2F" },
  { name: HAND_EYE_COORDINATION, className: "hand-eye-coordination", color: "#E67E22" },
  { name: "PERCEPTION", className: "perception", color: "#D39F10" },
  { name: "REACTION SPEED", className: "reaction-speed", color: "#D35400" },
  { name: "SAVOIR FAIRE", className: "savoir-faire", color: "#B8860B" },
  { name: "INTERFACING", className: "interfacing", color: "#A67C00" },
  { name: "COMPOSURE", className: "composure", color: "#C08A18" },
  { name: "ANCIENT REPTILIAN BRAIN", className: "ancient-reptilian-brain", color: "#3A6B58" },
  { name: "LIMBIC SYSTEM", className: "limbic-system", color: "#B33951" },
] as const;

export type Skill = (typeof SKILLS)[number];
export type SkillClass = Skill["className"];

/** Variant spellings (and common typos) mapped to canonical skill names. */
const SKILL_ALIASES: Record<string, Skill["name"]> = {
  "ESPRIT-DE-CORPS": ESPRIT_DE_CORPS,
  "HALF LIGHT": HALF_LIGHT,
  "HALFLIGHT": HALF_LIGHT,
  "HAND-EYE COORDINATION": HAND_EYE_COORDINATION,
  "HAND EYE COORDINATION": HAND_EYE_COORDINATION,
  "HAND/EYE COODINATION": HAND_EYE_COORDINATION,
};

export function findSkill(name: string): Skill | undefined {
  const canonical = SKILL_ALIASES[name] ?? name;
  return SKILLS.find((skill) => skill.name === canonical);
}