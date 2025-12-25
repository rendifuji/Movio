import { cn } from "@/lib/utils";
import { Google, LoginImage } from "@/assets/images";
import {
  Button,
  Card,
  CardContent,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  Input,
} from "@/components";
import { useState } from "react";
import { Link } from "react-router";

function Register({ className, ...props }: React.ComponentProps<"div">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRegistering(true);
    setError(null);

    try {
      console.log({ fullName, email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="absolute size-[700px] translate-x-48 opacity-50 rounded-full bg-primary -z-50 blur-3xl"></div>
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form
                className="p-6 md:p-8 border-r border-border"
                onSubmit={handleSubmit}
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-3xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground text-balance">
                      Sign up for Movio
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="abc@gmail.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </Field>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Field>
                    <Button type="submit" disabled={isRegistering}>
                      {isRegistering ? "Creating account…" : "Sign Up"}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field className="grid">
                    <Button variant="outline" type="button">
                      <img src={Google} alt="Google logo" />
                      <span>Sign up with Google</span>
                    </Button>
                  </Field>
                  <FieldDescription className="text-center">
                    Already have an account? <Link to="/login">Login</Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="bg-muted relative hidden md:block">
                <img
                  src={LoginImage}
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}

export default Register;
