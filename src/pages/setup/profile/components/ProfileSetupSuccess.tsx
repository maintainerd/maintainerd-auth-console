import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormLoginCard } from "@/components/form"

interface ProfileSetupSuccessProps {
  isCompleting?: boolean
  isComplete?: boolean
}

const ProfileSetupSuccess = ({ isComplete = false }: ProfileSetupSuccessProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isComplete) return
    const timer = setTimeout(() => {
      navigate("/login")
    }, 5000)
    return () => clearTimeout(timer)
  }, [navigate, isComplete])

  const handleContinue = () => {
    navigate("/login")
  }

  if (!isComplete) {
    return (
      <div className="flex flex-col gap-6">
        <FormLoginCard
          title="Finalizing Setup..."
          description="Locking your configuration"
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <p className="text-center text-gray-600">
              Please wait while we finalize your setup...
            </p>
          </div>
        </FormLoginCard>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Setup Complete!"
        description="Your instance is ready"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Welcome aboard!
            </h3>
            <p className="text-gray-600">
              Your profile has been successfully created and setup is complete. You can now sign in to access your account.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleContinue} className="w-full" size="lg">
              Continue to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-center text-gray-500">
              You'll be automatically redirected in 5 seconds
            </p>
          </div>
        </div>
      </FormLoginCard>
    </div>
  )
}

export default ProfileSetupSuccess
