
import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Package, ShoppingCart, Truck, Home, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckpointProps {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  isCompleted: boolean
  isActive: boolean
  onClick: () => void
  index: number
  totalPoints: number
}

const Checkpoint = ({
  id,
  title,
  description,
  icon,
  isCompleted,
  isActive,
  onClick,
  index,
  totalPoints,
}: CheckpointProps) => {
  // Alternate left and right for checkpoints
  const isLeft = index % 2 === 0

  return (
    <div className="relative" style={{ zIndex: totalPoints - index }}>
      {/* Checkpoint node */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
        className="relative"
      >
        {/* Connector line to next checkpoint */}
        {index < totalPoints - 1 && (
          <div className="absolute top-[40px] left-1/2 w-1 bg-gray-700 -translate-x-1/2 h-[100px]">
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: isCompleted ? "100%" : "0%" }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 to-violet-600 rounded-full"
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
        )}

        {/* Checkpoint circle */}
        <div className="flex justify-center mb-24">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500",
              isCompleted
                ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white"
                : isActive
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 border-2 border-gray-700",
            )}
          >
            <div className="relative z-10">{isCompleted ? <CheckCircle2 className="w-10 h-10" /> : icon}</div>

            {/* Ripple effect for active checkpoint */}
            {isActive && (
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-0 rounded-full animate-ping-slow bg-cyan-500 opacity-20" />
                <div className="absolute inset-0 rounded-full animate-ping-slow animation-delay-500 bg-cyan-500 opacity-20" />
              </div>
            )}

            {/* Checkpoint number badge */}
            <div
              className={cn(
                "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-gray-900",
                isCompleted
                  ? "bg-purple-600 text-white"
                  : isActive
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-700 text-gray-300",
              )}
            >
              {id}
            </div>
          </motion.button>
        </div>

        {/* Checkpoint content */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 + 0.1 }}
          className={cn(
            "absolute top-0 w-64 p-4 rounded-xl shadow-md bg-gray-800 border-2",
            isLeft ? "left-[calc(50%+50px)]" : "right-[calc(50%+50px)]",
            isCompleted
              ? "border-purple-500 shadow-purple-900/30"
              : isActive
                ? "border-cyan-500 shadow-cyan-900/30"
                : "border-gray-700",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-1 w-3 h-3 rounded-full",
                isCompleted ? "bg-purple-500" : isActive ? "bg-cyan-500" : "bg-gray-600",
              )}
            />
            <div>
              <h3
                className={cn(
                  "font-bold text-lg",
                  isCompleted ? "text-purple-400" : isActive ? "text-cyan-400" : "text-gray-300",
                )}
              >
                {title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{description}</p>

              {/* Status badge */}
              <div className="mt-2">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 bg-purple-900/40 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                ) : isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 bg-cyan-900/40 px-2 py-1 rounded-full animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    In Progress
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Connector line to main track */}
          <div
            className={cn(
              "absolute top-1/2 w-10 h-0.5 bg-gray-700 -translate-y-1/2",
              isLeft ? "left-[-10px]" : "right-[-10px]",
            )}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: isCompleted || isActive ? "100%" : "0%" }}
              className={cn("absolute top-0 h-full rounded-full", isCompleted ? "bg-purple-500" : "bg-cyan-500")}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Triangle pointer */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-0 h-0 border-solid border-8",
              isLeft
                ? "left-[-8px] border-r-gray-800 border-t-transparent border-l-transparent border-b-transparent"
                : "right-[-8px] border-l-gray-800 border-t-transparent border-r-transparent border-b-transparent",
            )}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function EnhancedOrderTracking() {
  const [checkpoints, setCheckpoints] = useState([
    {
      id: 1,
      title: "Order Placed",
      description: "Your order has been received and confirmed",
      icon: <ShoppingCart className="w-10 h-10" />,
      isCompleted: true,
    },
    {
      id: 2,
      title: "Processing",
      description: "We're preparing your items for shipment",
      icon: <ClipboardCheck className="w-10 h-10" />,
      isCompleted: false,
    },
    {
      id: 3,
      title: "Shipped",
      description: "Your package is on its way to our delivery center",
      icon: <Package className="w-10 h-10" />,
      isCompleted: false,
    },
    {
      id: 4,
      title: "Out for Delivery",
      description: "Your package is out for delivery with our courier",
      icon: <Truck className="w-10 h-10" />,
      isCompleted: false,
    },
    {
      id: 5,
      title: "Delivered",
      description: "Your package has been delivered successfully",
      icon: <Home className="w-10 h-10" />,
      isCompleted: false,
    },
  ])

  const [animatingTo, setAnimatingTo] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleCheckpointClick = (id: number) => {
    // Only allow clicking if the previous checkpoint is completed or it's the first checkpoint
    const clickedIndex = checkpoints.findIndex((cp) => cp.id === id)
    if (clickedIndex > 0 && !checkpoints[clickedIndex - 1].isCompleted) {
      return
    }

    // Set animating state
    setAnimatingTo(id)

    // Update checkpoints after animation
    setTimeout(() => {
      setCheckpoints((prev) => {
        const updatedCheckpoints = [...prev]

        // Mark all previous checkpoints as completed
        for (let i = 0; i <= clickedIndex; i++) {
          updatedCheckpoints[i].isCompleted = true
        }

        // Mark all following checkpoints as not completed
        for (let i = clickedIndex + 1; i < updatedCheckpoints.length; i++) {
          updatedCheckpoints[i].isCompleted = false
        }

        return updatedCheckpoints
      })

      // Clear animating state
      setTimeout(() => setAnimatingTo(null), 500)
    }, 1000)
  }

  // Find the active checkpoint (first incomplete one after completed ones)
  const activeCheckpointId = checkpoints.find((cp) => !cp.isCompleted)?.id || checkpoints[checkpoints.length - 1].id

  // Calculate progress percentage
  const progressPercentage = (checkpoints.filter((cp) => cp.isCompleted).length / checkpoints.length) * 100

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl shadow-xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Track Your Order</h2>
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-full border border-purple-800">
          <span className="text-gray-400">Order ID: </span>
          <span className="font-bold text-purple-400">#{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-400 mb-1">
          <span>Order Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full"
          />
        </div>
      </div>

      {/* Flowing animation overlay */}
      <AnimatePresence>
        {animatingTo !== null && (
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute left-1/2 top-0 w-20 -translate-x-1/2 pointer-events-none z-20"
            style={{
              height: trackRef.current
                ? `${(animatingTo / checkpoints.length) * trackRef.current.offsetHeight}px`
                : "0%",
            }}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-full h-full overflow-hidden"
            >
              <div className="w-4 h-full mx-auto bg-gradient-to-b from-purple-500 to-transparent rounded-full blur-md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main tracking timeline */}
      <div className="relative mx-auto" style={{ maxWidth: "700px" }} ref={trackRef}>
        {/* Center line */}
        <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-gray-700 -translate-x-1/2 rounded-full">
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 to-violet-600 rounded-full"
          />
        </div>

        {/* Checkpoints */}
        <div className="relative py-10">
          {checkpoints.map((checkpoint, index) => (
            <Checkpoint
              key={checkpoint.id}
              id={checkpoint.id}
              title={checkpoint.title}
              description={checkpoint.description}
              icon={checkpoint.icon}
              isCompleted={checkpoint.isCompleted}
              isActive={checkpoint.id === activeCheckpointId}
              onClick={() => handleCheckpointClick(checkpoint.id)}
              index={index}
              totalPoints={checkpoints.length}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-lg">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-violet-600"></div>
            <span className="text-sm text-gray-300">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"></div>
            <span className="text-sm text-gray-300">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-700 border-2 border-gray-600"></div>
            <span className="text-sm text-gray-300">Pending</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">
          Click on any checkpoint to mark it and all previous steps as completed
        </p>
      </div>
    </div>
  )
}