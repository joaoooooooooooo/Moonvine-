const k = 0.5522847498307936
const circle = [1, 0, 1, k, k, 1, 0, 1, -k, 1, -1, k, -1, 0, -1, -k, -k, -1, 0, -1, k, -1, 1, -k, 1, 0]

// Same transform order as the original CSS:
// view rotateX * view rotateY * ring rotateZ * ring rotateX.
// Project geometry first; the SVG renderer paints a constant-width stroke last.
export function projectRing(size, tilt, angle, viewX, viewY, phase, axis, flatten = 0, alignment = 0) {
  const rad = Math.PI / 180
  const ca = Math.cos(angle * rad), sa = Math.sin(angle * rad)
  const ct = Math.cos(tilt * rad), st = Math.sin(tilt * rad)
  const cx = Math.cos(viewX * rad), sx = Math.sin(viewX * rad)
  const cy = Math.cos(viewY * rad), sy = Math.sin(viewY * rad)
  let a = cy * ca
  let b = cx * sa + sx * sy * ca
  let c = -cy * sa * ct + sy * st
  let d = cx * ca * ct - sx * (sy * sa * ct + cy * st)
  if (flatten !== 0) {
    const uz = sx * sa - cx * sy * ca
    const vz = sx * ca * ct + cx * (sy * sa * ct + cy * st)
    // Rotate the composed plane toward its nearest camera-facing normal.
    // Both +Z and -Z are face-on; preserve its roll instead of unwinding Euler angles.
    const nx = b * vz - uz * d
    const ny = uz * c - a * vz
    const nz = a * d - b * c
    const length = Math.hypot(nx, ny)
    if (length > 1e-10) {
      const sign = nz < 0 ? -1 : 1
      const kx = sign * ny / length
      const ky = -sign * nx / length
      const theta = Math.atan2(length, Math.abs(nz)) * flatten
      const cos = Math.cos(theta), sin = Math.sin(theta), rest = 1 - cos
      const dotU = kx * a + ky * b
      const dotV = kx * c + ky * d
      a = a * cos + ky * uz * sin + kx * dotU * rest
      b = b * cos - kx * uz * sin + ky * dotU * rest
      c = c * cos + ky * vz * sin + kx * dotV * rest
      d = d * cos - kx * vz * sin + ky * dotV * rest
    }
  }
  const radius = size / 2
  if (phase !== undefined) {
    // Move along the same projected circumference, never across its interior.
    if (alignment !== 0) {
      const bottomPhase = Math.atan2(d, b) / rad
      const delta = ((bottomPhase - phase + 180) % 360 + 360) % 360 - 180
      phase += delta * alignment
    }
    const x = Math.cos(phase * rad), y = Math.sin(phase * rad)
    return radius * (axis === 'x' ? a * x + c * y : b * x + d * y)
  }
  let path = ''
  for (let i = 0; i < circle.length; i += 2) {
    const x = circle[i], y = circle[i + 1]
    path += `${i === 0 ? 'M' : (i - 2) % 6 === 0 ? 'C' : ' '}${radius * (a * x + c * y)},${radius * (b * x + d * y)}`
  }
  return `${path}Z`
}
