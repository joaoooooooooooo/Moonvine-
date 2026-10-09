// Damped torsional links transfer pressure between adjacent rings.
// No ring receives a target angle; only the touched ring receives force.
export const defaultInteraction = { enabled: true, strength: 7, sensitivity: 5, mass: 2, damping: 18, stiffness: 18, coupling: 24, response: 7, release: 180, cascade: 0, counter: true }

export function stepRingDynamics(state, order, hovered, strength, dt, settings = defaultInteraction) {
  state.pressure += ((hovered === null ? 0 : strength * 42) - state.pressure) * (1 - Math.exp(-dt * settings.response))
  if (hovered !== null) state.sourceRank = order.indexOf(hovered)
  const linkSign = settings.counter ? 1 : -1
  for (let rank = 0; rank < order.length; rank++) {
    const i = order[rank]
    let torque = -settings.stiffness * state.position[i] - settings.damping * state.velocity[i]
    if (i === hovered) torque += state.pressure
    // Adjacent rings counter-rotate through the same elastic link.
    if (rank > 0) torque -= settings.coupling * (state.position[i] + linkSign * state.position[order[rank - 1]])
    if (rank < order.length - 1) torque -= settings.coupling * (state.position[i] + linkSign * state.position[order[rank + 1]])
    const distance = Math.abs(rank - (state.sourceRank ?? rank))
    state.acceleration[i] = torque / (settings.mass * (1 + distance * settings.cascade))
  }
  for (let i = 0; i < state.position.length; i++) {
    state.velocity[i] += state.acceleration[i] * dt
    state.position[i] += state.velocity[i] * dt
  }
}
