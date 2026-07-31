export const FAMILIES = ['Fresh', 'Woody', 'Oriental', 'Sweet']

export const FAMILY_GROUPS = {
  Fresh: ['PF-002', 'PF-003', 'PF-008', 'PF-009'],
  Woody: ['PF-001', 'PF-003', 'PF-007', 'PF-009'],
  Oriental: ['PF-001', 'PF-005', 'PF-006', 'PF-007'],
  Sweet: ['PF-004', 'PF-005', 'PF-008'],
}

export const BOLDNESS = {
  'PF-001': 2,
  'PF-002': 1,
  'PF-003': 1,
  'PF-004': 1,
  'PF-005': 1,
  'PF-006': 2,
  'PF-007': 2,
  'PF-008': 0,
  'PF-009': 0,
}

export const primaryGrid = {
  Fresh: {
    Energetic: 'PF-002',
    Romantic: 'PF-008',
    Mysterious: 'PF-003',
    Serene: 'PF-009',
  },
  Woody: {
    Energetic: 'PF-003',
    Romantic: 'PF-001',
    Mysterious: 'PF-007',
    Serene: 'PF-009',
  },
  Oriental: {
    Energetic: 'PF-006',
    Romantic: 'PF-005',
    Mysterious: 'PF-007',
    Serene: 'PF-001',
  },
  Sweet: {
    Energetic: 'PF-008',
    Romantic: 'PF-004',
    Mysterious: 'PF-005',
    Serene: 'PF-004',
  },
}

export const SETTING_BOLDNESS = {
  Office: 0,
  'Daily Wear': 1,
  Travel: 1,
  'Evening Out': 2,
}

export const SILLAGE_BOLDNESS = {
  Subtle: 0,
  Moderate: 1,
  Strong: 1,
  Intense: 2,
}

export function targetBoldness(answers) {
  const setting = SETTING_BOLDNESS[answers[2]] ?? 1
  const sillage = SILLAGE_BOLDNESS[answers[3]] ?? 1
  return Math.round((setting + sillage) / 2)
}

export function recommendFragrance(answers, fragrances) {
  const q1 = answers[0]
  const q2 = answers[1]
  const primaryId = primaryGrid[q1]?.[q2]
  const primary = fragrances.find((f) => f.id === primaryId)
  if (!primary) return fragrances[0] ?? null

  const target = targetBoldness(answers)
  if (target === 1) return primary

  const group = FAMILY_GROUPS[q1] ?? []
  let best = primary
  let bestDist = Infinity
  group.forEach((id) => {
    const f = fragrances.find((x) => x.id === id)
    if (!f) return
    const dist = Math.abs(target - (BOLDNESS[id] ?? 1))
    if (dist < bestDist) {
      bestDist = dist
      best = f
    }
  })
  return best
}

export function describeFragrance(f) {
  if (f.description) return f.description
  return `${f.name} is a ${f.notes.toLowerCase()} composition by ${f.brand}, crafted with ${f.ingredients.join(
    ', '
  )} to suit your unique sensory profile.`
}
