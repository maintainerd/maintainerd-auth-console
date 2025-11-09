import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormLoginCard } from "@/components/form"

const ProfileSetupSuccess = () => {
  const navigate = useNavigate()

  // Auto-redirect after 5 seconds if user doesn't click
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login")
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  const handleContinue = () => {
    navigate("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Profile Created Successfully!"
        description="You're all set and ready to get started"
      >
        <div className="space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Welcome aboard!
            </h3>
            <p className="text-gray-600">
              Your profile has been successfully created. You can now sign in to access your account.
            </p>
          </div>

          {/* Continue Button */}
          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full"
              size="lg"
            >
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
