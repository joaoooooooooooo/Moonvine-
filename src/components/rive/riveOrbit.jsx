import { useRive } from '@rive-app/react-webgl2'

import moonvineOrbitSrc from '../../assets/rive files/moonvine orbit.riv?url'

export default function RiveOrbit({
  className,
  style,
  stateMachines = 'State Machine 1',
  ...props
}) {
  const { RiveComponent } = useRive({
    src: moonvineOrbitSrc,
    stateMachines,
    autoplay: true,
  })

  return <RiveComponent className={className} style={style} {...props} />
}
