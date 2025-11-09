import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { MultiStepForm, type MultiStepFormStep } from "@/components/form"
import { setupService } from "@/services"
import { useToast } from "@/hooks/useToast"
import type { CreateProfileRequest } from "@/services/api/types/setup"
import PersonalInfoStep from "./steps/PersonalInfoStep"
import ContactInfoStep from "./steps/ContactInfoStep"
import LocationPreferencesStep from "./steps/LocationPreferencesStep"
import ProfileSummaryStep from "./steps/ProfileSummaryStep"
import ProfileSetupSuccess from "./ProfileSetupSuccess"

const SetupProfileForm = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { showError, showSuccess, parseError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isProfileCreated, setIsProfileCreated] = useState(false)
  const navigationTimeoutRef = useRef<number | null>(null)

  const stepMap = {
    'personal': 0,
    'contact': 1,
    'location': 2,
    'summary': 3
  }
  const stepNames = ['personal', 'contact', 'location', 'summary']
  const currentStepParam = searchParams.get('step') || 'personal'
  const currentStep = stepMap[currentStepParam as keyof typeof stepMap] ?? 0

  useEffect(() => {
    if (!searchParams.get('step')) {
      setSearchParams({ step: 'personal' }, { replace: true })
    }
  }, [])
  
  const [formData, setFormData] = useState<Partial<CreateProfileRequest>>({})
  const [stepValidation, setStepValidation] = useState({
    personal: false,
    contact: false,
    location: false,
    summary: true // Summary step is always valid since it's just for review
  })

  const updateFormData = useCallback((stepData: Partial<CreateProfileRequest>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }, [])

  const updateStepValidation = useCallback((step: string, isValid: boolean) => {
    setStepValidation(prev => ({ ...prev, [step]: isValid }))
  }, [])

  const handleEditStep = useCallback((stepIndex: number) => {
    const stepName = stepNames[stepIndex]
    if (stepName) {
      setSearchParams({ step: stepName }, { replace: true })
    }
  }, [stepNames, setSearchParams])

  const handleStepChange = useCallback((stepIndex: number) => {
    const stepName = stepNames[stepIndex]
    if (stepName && stepName !== searchParams.get('step')) {
      setSearchParams({ step: stepName })
    }
  }, [stepNames, searchParams, setSearchParams])

  const handleNext = useCallback(async () => {
    if (isNavigating) return

    setIsNavigating(true)

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }

    try {
      const nextStepIndex = currentStep + 1
      if (nextStepIndex < stepNames.length) {
        handleStepChange(nextStepIndex)
      }
    } finally {
      navigationTimeoutRef.current = setTimeout(() => setIsNavigating(false), 100)
    }
  }, [isNavigating, currentStep, stepNames, handleStepChange, navigationTimeoutRef])

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        throw new Error('Missing required profile information')
      }
      // Generate display name from first and last name
      const displayName = `${formData.first_name} ${formData.last_name}`

      const profileData: CreateProfileRequest = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: displayName,
        bio: formData.bio || undefined,
        birthdate: formData.birthdate || undefined,
        gender: formData.gender || undefined,
        phone: formData.phone || undefined,
        email: formData.email,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        timezone: formData.timezone || undefined,
        language: formData.language || undefined
      }
      await setupService.createProfile(profileData)

      // Set success state to show the success page
      setIsProfileCreated(true)
    } catch (err) {
      // Parse the error to check if it's a validation error with field-specific details
      const parsedError = parseError(err)

      if (parsedError.isValidationError && parsedError.fieldErrors) {
        // Handle field-specific validation errors
        // For now, we'll still show a toast, but you could also:
        // 1. Set field-specific errors in form state
        // 2. Navigate to the step containing the invalid field
        // 3. Highlight the problematic fields

        const fieldErrorMessages = Object.entries(parsedError.fieldErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n')

        showError(`${parsedError.message}\n\nField errors:\n${fieldErrorMessages}`, "Validation Failed")
      } else {
        // Handle general errors
        showError(err, "Failed to create profile")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps: MultiStepFormStep[] = [
    {
      id: "personal",
      title: "Complete Your Profile",
      description: "Tell us about yourself",
      content: (
        <PersonalInfoStep
          data={formData}
          onDataChange={updateFormData}
          onValidationChange={(isValid) => updateStepValidation('personal', isValid)}
        />
      ),
      isValid: stepValidation.personal
    },
    {
      id: "contact",
      title: "Complete Your Profile",
      description: "How can we reach you?",
      content: (
        <ContactInfoStep
          data={formData}
          onDataChange={updateFormData}
          onValidationChange={(isValid) => updateStepValidation('contact', isValid)}
        />
      ),
      isValid: stepValidation.contact
    },
    {
      id: "location",
      title: "Complete Your Profile",
      description: "Customize your experience",
      content: (
        <LocationPreferencesStep
          data={formData}
          onDataChange={updateFormData}
          onValidationChange={(isValid) => updateStepValidation('location', isValid)}
        />
      ),
      isValid: stepValidation.location,
      isOptional: true
    },
    {
      id: "summary",
      title: "Review & Create Profile",
      description: "Review your information and create your profile",
      content: (
        <ProfileSummaryStep
          data={formData}
          onEditStep={handleEditStep}
        />
      ),
      isValid: stepValidation.summary
    }
  ]

  const currentStepData = steps[currentStep]
  const canGoNext = currentStepData?.isValid || currentStepData?.isOptional || false

  // Show success page if profile was created successfully
  if (isProfileCreated) {
    return <ProfileSetupSuccess />
  }

  return (
    <div className="flex flex-col gap-6">
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onNext={handleNext}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
        canGoNext={canGoNext}
        nextButtonText="Continue"
        completeButtonText="Create Profile"
        showStepNumbers={false}
        showProgress={false}
        className="max-w-2xl mx-auto"
      />
    </div>
  )
}

export default SetupProfileForm
