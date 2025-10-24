import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

const SetupOrganizationForm = () => {
	const navigate = useNavigate();

	const onSubmit = () => {
		navigate("/setup/admin");
	}

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Setup Organization</CardTitle>
          <CardDescription>
            Enter your organizations details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" type="text" placeholder="Organization name" required />
              </Field>
							<Field>
                <FieldLabel htmlFor="name">Description</FieldLabel>
                <Input id="name" type="text" placeholder="Describe your organization" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="org@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Phone</FieldLabel>
                <Input id="name" type="text" placeholder="+1 234 567 890" required />
              </Field>
              <Field>
                <Button type="button" onClick={onSubmit}>Create Organization</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupOrganizationForm;
