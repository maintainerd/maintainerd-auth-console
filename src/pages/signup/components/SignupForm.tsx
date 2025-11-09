import { FormLoginCard, FormSubmitButton } from "@/components/form"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const SignupForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Create your account"
        description="Enter your email below to create your account"
      >
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                required
              />
							<FieldDescription>
								We&apos;ll use this to contact you. We will not share your email
								with anyone else.
							</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
								Must be at least 8 characters long.
              </FieldDescription>
          	</Field>
						<Field>
              <FieldLabel htmlFor="confirm-password">
								Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
						</Field>
            <FormSubmitButton
              isSubmitting={false}
              submitText="Create Account"
            />
            <Field>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}

export default SignupForm;
