import { useEffect, useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'motion/react'
import './preloader.css'

/** Per-column exit: delay increases along reveal axis; all use the same move duration. */
const STAIR_STAGGER_S = 0.055
const STAIR_MOVE_DURATION_S = 0.5
/**
 * After the last column’s motion, only a few ms before unmount — long “settle” waits
 * with columns already gone read as a blank / empty screen.
 */
const STAIR_EXIT_SETTLE_MS = 32
const STAIR_EASE = [0.3, 0.85, 0.22, 1]

function maxStairExitMs(stairCount) {
  const lastIndex = Math.max(0, stairCount - 1)
  const lastDelayS = lastIndex * STAIR_STAGGER_S
  return Math.ceil((lastDelayS + STAIR_MOVE_DURATION_S) * 1000) + STAIR_EXIT_SETTLE_MS
}

/** Time until preloader unmounts after loading finishes (must cover last stagger + move duration + settle). */
function getExitDurationMs(variant, stairCount) {
  if (variant === 'stairs') {
    return maxStairExitMs(stairCount)
  }
  if (variant === 'percentage') return 480
  if (variant === 'circle') return 820
  return 400
}

const Preloader = ({
  loading,
  variant = 'stairs',
  position = 'fixed',
  duration = 2200,
  loadingText = 'Building your experience',
  onComplete,
  onLoadingStart,
  onLoadingComplete,
  className = '',
  zIndex = 9999,
  bgColor,
  textClassName = '',
  children,
  stairCount = 10,
  /** 'covered' = panels start full-screen, then slide off when ready. 'fromBottom' = rise into view first, then exit. */
  stairsEntrance = 'covered',
  stairsRevealFrom = 'left',
  stairsRevealDirection = 'up',
  percentagePosition = 'center',
  showPercentageSign = true,
  showProgressBar = true,
  progressBarPosition = 'bottom',
  textFadeThreshold = 96,
}) => {
  const [progress, setProgress] = useState(loading ? 0 : 100)
  const [showPreloader, setShowPreloader] = useState(loading)
  const [hideText, setHideText] = useState(!loading)
  const rafRef = useRef(null)
  const textHiddenRef = useRef(!loading)
  const hasStartedRef = useRef(false)
  const prevLoadingRef = useRef(loading)

  useEffect(() => {
    const prevLoading = prevLoadingRef.current
    prevLoadingRef.current = loading

    if (loading && !prevLoading) {
      textHiddenRef.current = false
      flushSync(() => {
        setShowPreloader(true)
        setHideText(false)
        setProgress(0)
      })
    }
  }, [loading])

  useEffect(() => {
    let timeoutId

    if (loading) {
      const startTime = Date.now()
      let isActive = true

      if (!hasStartedRef.current) {
        hasStartedRef.current = true
        onLoadingStart?.()
      }

      const updateProgress = () => {
        if (!isActive) return
        const elapsed = Date.now() - startTime
        let newProgress = (elapsed / duration) * 100
        if (newProgress > 90) newProgress = 90 + (newProgress - 90) * 0.1
        newProgress = Math.min(newProgress, 99)
        setProgress(newProgress)
        if (newProgress >= textFadeThreshold && !textHiddenRef.current) {
          textHiddenRef.current = true
          setHideText(true)
        }
        rafRef.current = requestAnimationFrame(updateProgress)
      }

      updateProgress()
      return () => {
        isActive = false
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    } else if (!loading && showPreloader) {
      hasStartedRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      flushSync(() => {
        setProgress(100)
        if (!textHiddenRef.current) {
          textHiddenRef.current = true
          setHideText(true)
        }
      })

      const exitMs = getExitDurationMs(variant, stairCount)
      timeoutId = setTimeout(() => {
        setShowPreloader(false)
        onLoadingComplete?.()
        queueMicrotask(() => onComplete?.())
      }, exitMs)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [
    loading,
    duration,
    onComplete,
    onLoadingStart,
    onLoadingComplete,
    showPreloader,
    textFadeThreshold,
    variant,
    stairCount,
  ])

  const renderLoadingText = () => {
    const words = loadingText.split(' ')
    return (
      <div className="pre-text" style={{ zIndex: zIndex + 1 }}>
        <div className="pre-text-inner">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
              animate={
                hideText
                  ? { opacity: 0, filter: 'blur(12px)', y: -8 }
                  : { opacity: 1, filter: 'blur(0px)', y: 0 }
              }
              transition={{
                duration: hideText ? 0.28 : 0.55,
                delay: hideText ? 0 : i * 0.08,
                ease: [0.65, 0, 0.35, 1],
              }}
              className={`pre-text-word ${textClassName}`}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    )
  }

  const stairsExitPhase = variant === 'stairs' && showPreloader && !loading

  const renderCenter = () => (
    <div className="pre-center" style={{ zIndex: zIndex + 2 }}>
      <motion.div
        className="pre-center__inner"
        initial={{ opacity: 0, y: 12 }}
        animate={
          stairsExitPhase
            ? { opacity: 0, y: -10, scale: 0.98 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{
          duration: stairsExitPhase ? 0.38 : 0.6,
          delay: stairsExitPhase ? 0 : 0.2,
          ease: [0.65, 0, 0.35, 1],
        }}
      >
        <div className="pre-center__mark">
          <div className="pre-center__icon-halo" aria-hidden />
          <div className="pre-center__icon-frame">
            <img
              src="/webrunner-icon.svg"
              alt=""
              width={112}
              height={112}
              className="pre-center__icon"
            />
          </div>
        </div>
        <div className="pre-center__wordmark">
          <span className="pre-center__brand">WebRunner</span>
          <span className="nav__brand-badge pre-center__badge">Agency</span>
        </div>
        <span className="pre-center__tagline">Design-led digital studio</span>
      </motion.div>
    </div>
  )

  const renderLogo = () => (
    <div className="pre-logo" style={{ zIndex: zIndex + 2 }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
        className="pre-logo-inner"
      >
        <div className="pre-logo-icon-frame">
          <img src="/webrunner-icon.svg" alt="" width={40} height={40} className="pre-logo-icon" />
        </div>
        <div className="pre-logo-wordmark">
          <span className="pre-logo-name">WebRunner</span>
          <span className="nav__brand-badge">Agency</span>
        </div>
      </motion.div>
    </div>
  )

  const renderStairs = () => {
    const stairs = Array.from({ length: stairCount })
    const getDelay = (i) => {
      if (stairsRevealFrom === 'left') return i * STAIR_STAGGER_S
      if (stairsRevealFrom === 'right') return (stairCount - 1 - i) * STAIR_STAGGER_S
      const mid = (stairCount - 1) / 2
      return Math.abs(i - mid) * STAIR_STAGGER_S
    }
    const exitY = stairsRevealDirection === 'up' ? '-100%' : '100%'
    const enterY = stairsRevealDirection === 'up' ? '100%' : '-100%'
    const stairsExiting = showPreloader && !loading
    const startCovered = stairsEntrance === 'covered'
    const initialY = startCovered ? '0%' : enterY

    return (
      <div className={`pre-stairs pre-${position}`} style={{ zIndex }} role="status" aria-label="Loading WebRunner">
        {stairs.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: initialY }}
            animate={{ y: stairsExiting ? exitY : '0%' }}
            transition={{
              type: 'tween',
              duration: STAIR_MOVE_DURATION_S,
              delay: getDelay(i),
              ease: STAIR_EASE,
            }}
            className="pre-stair"
            style={{ backgroundColor: bgColor || undefined }}
          >
            {!bgColor && <div className="pre-stair-fill" />}
          </motion.div>
        ))}
        {renderCenter()}
        {renderLoadingText()}
      </div>
    )
  }

  const renderPercentage = () => {
    const n = Math.floor(progress)
    const posClass =
      percentagePosition === 'bottom-left' ? 'pre-pct-bl'
      : percentagePosition === 'top-left' ? 'pre-pct-tl' : ''

    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`pre-pct pre-${position} ${posClass}`}
        style={{ zIndex, backgroundColor: bgColor || undefined }}
        role="progressbar"
        aria-valuenow={n}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {renderLogo()}
        <div className="pre-pct-number">
          {n}{showPercentageSign && <span className="pre-pct-sym">%</span>}
        </div>
        {showProgressBar && (
          <div className={`pre-bar-wrap ${progressBarPosition === 'top' ? 'pre-bar-top' : ''}`}>
            <motion.div
              className="pre-bar"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>
        )}
        {renderLoadingText()}
      </motion.div>
    )
  }

  const renderCircle = () => (
    <div className={`pre-circle-wrap pre-${position}`} style={{ zIndex }} role="status">
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        className="pre-circle-shape"
        style={{ backgroundColor: bgColor || undefined }}
      >
        {!bgColor && <div className="pre-circle-fill" />}
      </motion.div>
      {renderLogo()}
      {renderLoadingText()}
    </div>
  )

  return (
    <div className={`pre-wrapper ${className}`}>
      {showPreloader ? (
        <div key="preloader">
          {variant === 'stairs' && renderStairs()}
          {variant === 'percentage' && renderPercentage()}
          {variant === 'circle' && renderCircle()}
        </div>
      ) : null}
      <div className={showPreloader ? 'pre-content pre-content-hidden' : 'pre-content'}>
        {children}
      </div>
    </div>
  )
}

Preloader.displayName = 'Preloader'
export default Preloader
