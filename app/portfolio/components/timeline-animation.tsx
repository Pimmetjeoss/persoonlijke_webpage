import { motion, useInView, type Variants, type MotionProps } from "motion/react"
import type React from "react"

type TimelineContentProps = {
  children?: React.ReactNode
  animationNum: number
  className?: string
  timelineRef: React.RefObject<HTMLElement | null>
  as?: keyof typeof motion
  customVariants?: Variants
  once?: boolean
}

const defaultSequenceVariants = {
  visible: (i: number) => ({
    filter: "blur(0px)",
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.5,
      duration: 0.5,
    },
  }),
  hidden: {
    filter: "blur(20px)",
    y: 0,
    opacity: 0,
  },
} as const satisfies Variants

export const TimelineContent = ({
  children,
  animationNum,
  timelineRef,
  className,
  as = "div",
  customVariants,
  once = false,
}: TimelineContentProps) => {
  const sequenceVariants = customVariants ?? defaultSequenceVariants

  const isInView = useInView(timelineRef, {
    once,
  })

  const MotionComponent = motion[as] as React.ComponentType<
    MotionProps & { className?: string }
  >

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={sequenceVariants}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}