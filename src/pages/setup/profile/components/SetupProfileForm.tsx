import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { MultiStepForm, type MultiStepFormStep } from "@/components/form"
import { setupService } from "@/services"
import { useToast } from "@/hooks/useToast"
import type { CreateProfileRequest } from "@/services/api/types/setup"
import PersonalInfoStep from "./steps/PersonalInfoStep"
import ContactInfoStep from "./steps/ContactInfoStep"
import LocationPreferencesStep from "./steps/LocationPreferencesStep"
import ProfilePictureStep from "./steps/ProfilePictureStep"

const SetupProfileForm = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { showError, showSuccess } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const navigationTimeoutRef = useRef<number | null>(null)

  const stepMap = {
    'personal': 0,
    'contact': 1,
    'location': 2,
    'picture': 3
  }
  const stepNames = ['personal', 'contact', 'location', 'picture']
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
    picture: false
  })

  const updateFormData = useCallback((stepData: Partial<CreateProfileRequest>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }, [])

  const updateStepValidation = useCallback((step: string, isValid: boolean) => {
    setStepValidation(prev => ({ ...prev, [step]: isValid }))
  }, [])

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
      if (!formData.first_name || !formData.last_name || !formData.display_name || !formData.email) {
        throw new Error('Missing required profile information')
      }
      const profileData: CreateProfileRequest = {
        first_name: formData.first_name,
        middle_name: formData.middle_name || undefined,
        last_name: formData.last_name,
        suffix: formData.suffix || undefined,
        display_name: formData.display_name,
        bio: formData.bio || undefined,
        birthdate: formData.birthdate || undefined,
        gender: formData.gender || undefined,
        phone: formData.phone || undefined,
        email: formData.email,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        timezone: formData.timezone || undefined,
        language: formData.language || undefined,
        profile_url: formData.profile_url || undefined
      }
      await setupService.createProfile(profileData)
      showSuccess("Profile created successfully!")
      navigate("/login")
    } catch (err) {
      showError(err, "Failed to create profile")
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
      id: "picture",
      title: "Complete Your Profile",
      description: "Add a profile picture",
      content: (
        <ProfilePictureStep
          data={formData}
          onDataChange={updateFormData}
          onValidationChange={(isValid) => updateStepValidation('picture', isValid)}
        />
      ),
      isValid: stepValidation.picture,
      isOptional: true
    }
  ]

  const currentStepData = steps[currentStep]
  const canGoNext = currentStepData?.isValid || currentStepData?.isOptional || false

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
