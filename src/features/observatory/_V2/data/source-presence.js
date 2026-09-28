// Local sample source shares, totaling 100%, for the V2 overview.
export function sourcePresenceData(account) {
  return [
    ...['Superside', 'Curio Digital', 'Hlabs', "It's Nice That"].map((label, index) => ({
      channel: `source-${index}`, label, value: 17, role: 'comparison', kind: 'entity', isCompetitor: index < 3,
    })),
    { channel: account.id, label: account.name, value: 12, role: 'subject', kind: 'entity' },
    { channel: 'others', label: 'Others', value: 20, role: 'comparison', kind: 'others' },
  ];
}
