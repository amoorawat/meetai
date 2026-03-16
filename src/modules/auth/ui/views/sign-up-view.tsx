"use client";

import { Card, CardContent } from "@/components/ui/card";
import {z} from "zod";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
  email: z.email(),
  password: z.string().min(1, { message: "password is required" }),
  confirmPassword: z.string().min(1, {message: "password is required"})
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"]
})

export const SignUpView = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false)
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit:  ({value}) => {
      setError(null);
      setPending(true)
      authClient.signUp.email(
        {
            name: value.name,
          email: value.email,
          password: value.password
          
        },
        {
          onSuccess: () => {
            router.push("/");
            setPending(false)

          },
          onError: ({error}) => {
            setError(error.message);
            setPending(false)

          },
        },
      );
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Let&apos;s get started</h1>
                <p className="text-muted-foreground text-balance">
                  Create your account
                </p>
              </div>
              <div className="grid gap-3">
                <Field name="name">
                  {(field) => {
                    const {errors} = field.state.meta
                    return (
                      <div className="flex flex-col gap-0.5">
                        <Label
                          htmlFor="name"
                          className="text-lg font-semibold ml-2"
                        >
                          name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="john doe"
                        />
                        {errors.length > 0 && (
                            <span className="text-destructive">{errors[0]?.message}</span>
                        )}
                      </div>
                    );
                  }}
                </Field>
              </div>
              <div className="grid gap-3">
                <Field name="email">
                  {(field) => {
                    const {errors} = field.state.meta
                    return (
                      <div className="flex flex-col gap-0.5">
                        <Label
                          htmlFor="email"
                          className="text-lg font-semibold ml-2"
                        >
                          email
                        </Label>
                        <Input
                          id="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="email"
                        />
                        {errors.length > 0 && (
                            <span className="text-destructive">{errors[0]?.message}</span>
                        )}
                      </div>
                    );
                  }}
                </Field>
              </div>
              <div className="grid gap-3">
                <Field name="password">
                  {(field) => {
                    const {errors} = field.state.meta
                    return (
                      <div className="flex flex-col gap-0.5">
                        <Label
                          htmlFor="password"
                          className="text-lg font-semibold ml-2"
                        >
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="*********"
                        />
                        {errors.length > 0 && (
                            <span className="text-destructive">{errors[0]?.message}</span>
                        )}
                        
                      </div>
                      
                    );
                  }}
                </Field>
              </div>
              <div className="grid gap-3">
                <Field name="confirmPassword">
                  {(field) => {
                    const {errors} = field.state.meta
                    return (
                      <div className="flex flex-col gap-0.5">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-lg font-semibold ml-2"
                        >
                          confirmPassword
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="*********"
                        />
                        {errors.length > 0 && (
                            <span className="text-destructive">{errors[0]?.message}</span>
                        )}
                        
                      </div>
                      
                    );
                  }}
                </Field>
              </div>
              {!!error && (
                <Alert className="bg-destructive/10 border-none">
                  <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}
              <Button type="submit" disabled={pending} className="w-full">
                Sign up
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant={"outline"} disabled={pending} type="button" className="w-full">
                  Google
                </Button>
                <Button variant={"outline"} disabled={pending} type="button" className="w-full">
                  Github
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={"/sign-in"}
                  className="underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="logo" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Services</a>{" "}
        and <a href="#">Privacy and Policy</a>
      </div>
    </div>
  );
};
