'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { toast } from "@/hooks/use-toast"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth";

const login_schema = z.object({
    email: z.string({ invalid_type_error: "Email is invalid", required_error: "Email is required" }).email("Email is invalid"),
    password: z.string({ invalid_type_error: "Password is invalid", required_error: "Password is required" }).min(8, "The password should be at least 8 characters long"),
    remember: z.boolean().default(false).optional(),
});

export default function Login() {
    const form = useForm<z.infer<typeof login_schema>>({
        resolver: zodResolver(login_schema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    function onValidSubmit(data: z.infer<typeof login_schema>) {
        signIn("credentials", {
            redirect: true,
            redirectTo: "/",
            login: {
                email: data.email,
                password: data.password,
                remember: data.remember,
            }
        });
    }

    function onInvalidSubmit(errors: FieldErrors<{ email: string; password: string }>) {
        if (errors.email) {
            showErrorToast("Email field error", errors.email.message!);
        } else if (errors.password) {
            showErrorToast("Password field error", errors.password.message!);
        }
    }

    function showErrorToast(toast_title: string, toast_description: string) {
        toast({
            variant: "destructive",
            title: toast_title,
            description: toast_description,
        });
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form { ... form }>
                                <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}>
                                    <div className="flex flex-col gap-6">
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <FormControl>
                                                    <Input id="email" type="text" placeholder="email@example.com" content={field.value} onChange={field.onChange} required />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="password" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">Password</Label>
                                                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                                        Forgot your password?
                                                    </a>
                                                </div>
                                                <FormControl>
                                                    <Input id="password" type="password" content={field.value} onChange={field.onChange} required/>
                                                </FormControl>
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="remember" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <div className="flex items-center">
                                                    <FormControl>
                                                        <Switch id="remember" checked={field.value} onChange={field.onChange} className="mr-4" required/>
                                                    </FormControl>
                                                    <Label htmlFor="password">Remember me</Label>
                                                </div>
                                            </FormItem>
                                        )}/>
                                        <Button type="submit" className="w-full">
                                            Login
                                        </Button>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <a href="#" className="underline underline-offset-4">
                                            Sign up
                                        </a>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}