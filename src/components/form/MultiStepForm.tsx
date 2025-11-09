/**
 * Multi-Step Form Component
 * A reusable component for creating multi-step forms with progress indicator
 */

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MultiStepFormStep {
  id: string
  title: string
  description?: string
  content: ReactNode
  isValid?: boolean
  isOptional?: boolean
}

export interface MultiStepFormProps {
  steps: MultiStepFormStep[]
  currentStep: number
  onStepChange: (step: number) => void
  onNext?: () => void | Promise<void>
  onPrevious?: () => void
  onComplete?: () => void | Promise<void>
  isSubmitting?: boolean
  className?: string
  showProgress?: boolean
  showStepNumbers?: boolean
  nextButtonText?: string
  previousButtonText?: string
  completeButtonText?: string
  canGoNext?: boolean
  canGoPrevious?: boolean
}

export default function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onPrevious,
  onComplete,
  isSubmitting = false,
  className,
  showProgress = true,
  showStepNumbers = true,
  nextButtonText = "Next",
  previousButtonText = "Previous",
  completeButtonText = "Complete",
  canGoNext = true,
  canGoPrevious = true
}: MultiStepFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    if (!canGoNext || isProcessing) return
    
    setIsProcessing(true)
    try {
      if (onNext) {
        await onNext()
      }
      
      if (isLastStep) {
        if (onComplete) {
          await onComplete()
        }
      } else {
        onStepChange(currentStep + 1)
      }
    } catch (error) {
      console.error('Error in next step:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrevious = () => {
    if (!canGoPrevious || isProcessing || isFirstStep) return
    
    if (onPrevious) {
      onPrevious()
    }
    onStepChange(currentStep - 1)
  }

  const handleStepClick = (stepIndex: number) => {
    if (isProcessing || stepIndex === currentStep) return
    
    // Only allow going to previous steps or next step if current is valid
    if (stepIndex < currentStep || (stepIndex === currentStep + 1 && canGoNext)) {
      onStepChange(stepIndex)
    }
  }

  return (
    <div className={cn("w-full mx-auto", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {/* Step Indicators */}
      {showStepNumbers && (
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={isProcessing}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStep
                      ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">{currentStepData.title}</h2>
          {currentStepData.description && (
            <p className="text-muted-foreground">{currentStepData.description}</p>
          )}
        </div>
        
        <div className="min-h-[300px]">
          {currentStepData.content}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isProcessing || isSubmitting || !canGoPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {previousButtonText}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext || isProcessing || isSubmitting}
          className="flex items-center gap-2"
        >
          {isLastStep ? completeButtonText : nextButtonText}
          {!isLastStep && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
