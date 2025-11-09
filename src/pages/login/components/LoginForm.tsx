import { FormLoginCard, FormSubmitButton } from "@/components/form"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const LoginForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Login to your account"
        description="Enter your email below to login to your account"
      >
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                required
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </Field>
            <FormSubmitButton
              isSubmitting={false}
              submitText="Login"
            />
            <Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}


export default LoginForm;