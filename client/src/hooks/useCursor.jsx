import { PerfectCursor } from 'perfect-cursors'
import { useCallback, useLayoutEffect, useState } from 'react'

export function usePerfectCursor(cb, point) {
  const [pc] = useState(() => new PerfectCursor(cb))

  useLayoutEffect(() => {
    if (point) pc.addPoint(point)
    return () => pc.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pc])

  const onPointChange = useCallback((point) => pc.addPoint(point), [pc])

  return onPointChange
}