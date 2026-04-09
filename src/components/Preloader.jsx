import { useEffect, useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import './preloader.css'

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
    let completeTimeoutId

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
    } else if (showPreloader) {
      hasStartedRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      const immediateId = setTimeout(() => {
        setProgress(100)
        if (!textHiddenRef.current) {
          textHiddenRef.current = true
          setHideText(true)
        }
      }, 0)

      timeoutId = setTimeout(() => {
        setShowPreloader(false)
        completeTimeoutId = setTimeout(() => onComplete?.(), 800)
      }, 300)

      return () => {
        clearTimeout(immediateId)
        clearTimeout(timeoutId)
        clearTimeout(completeTimeoutId)
      }
    }
  }, [loading, duration, onComplete, onLoadingStart, showPreloader, textFadeThreshold])

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

  const renderCenter = () => (
    <div className="pre-center" style={{ zIndex: zIndex + 2 }}>
      {/* Inner content */}
      <motion.div
        className="pre-center__inner"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
      >
        <img src="/webrunner-icon.svg" alt="" width={38} height={38} className="pre-center__icon" />
        <span className="pre-center__brand">WEBRUNNER</span>
        <span className="pre-center__tagline">Digital studio</span>
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
        <img src="/webrunner-icon.svg" alt="WebRunner" width={36} height={36} />
        <span className="pre-logo-name">WEBRUNNER</span>
      </motion.div>
    </div>
  )

  const renderStairs = () => {
    const stairs = Array.from({ length: stairCount })
    const getDelay = (i) => {
      if (stairsRevealFrom === 'left') return i * 0.055
      if (stairsRevealFrom === 'right') return (stairCount - 1 - i) * 0.055
      const mid = (stairCount - 1) / 2
      return Math.abs(i - mid) * 0.055
    }
    const exitY = stairsRevealDirection === 'up' ? '-100%' : '100%'

    return (
      <div className={`pre-stairs pre-${position}`} style={{ zIndex }} role="status" aria-label="Loading WebRunner">
        {stairs.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '0%' }}
            animate={{ y: '0%' }}
            exit={{ y: exitY }}
            transition={{ duration: 0.55, delay: getDelay(i), ease: [0.65, 0, 0.35, 1] }}
            className="pre-stair"
            style={{ backgroundColor: bgColor || undefined }}
          >
            {!bgColor && <div className="pre-stair-fill" />}
          </motion.div>
        ))}
        {renderLogo()}
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
      <AnimatePresence onExitComplete={onLoadingComplete}>
        {showPreloader && (
          <div key="preloader">
            {variant === 'stairs' && renderStairs()}
            {variant === 'percentage' && renderPercentage()}
            {variant === 'circle' && renderCircle()}
          </div>
        )}
      </AnimatePresence>
      <div className={showPreloader ? 'pre-content pre-content-hidden' : 'pre-content'}>
        {children}
      </div>
    </div>
  )
}

Preloader.displayName = 'Preloader'
export default Preloader
