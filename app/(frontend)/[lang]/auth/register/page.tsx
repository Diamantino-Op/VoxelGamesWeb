'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";

import { cn } from "@/lib/utils";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth";
import { encryptWithPublicKey } from "@/lib/encryption";

//TODO: passoword does not match
const register_schema = z.object({
    username: z.string({ invalid_type_error: "Username is invalid", required_error: "Username is required" }),
    name: z.string({ invalid_type_error: "Name is invalid", required_error: "Name is required" }),
    surname: z.string({ invalid_type_error: "Surname is invalid", required_error: "Surname is required" }),
    email: z.string({ invalid_type_error: "Email is invalid", required_error: "Email is required" }).email("Email is invalid"),
    password: z.string({ invalid_type_error: "Password is invalid", required_error: "Password is required" }).min(8, "The password should be at least 8 characters long"),
    repeat_password: z.string({ invalid_type_error: "Repeat password is invalid", required_error: "Repeat password is required" }).min(8, "The password should be at least 8 characters long"),
    user_registration_token: z.string({ invalid_type_error: "User registration token is invalid", required_error: "User registration token is required" }),
});

export default function Register() {
    const form = useForm<z.infer<typeof register_schema>>({
        resolver: zodResolver(register_schema),
        defaultValues: {
            username: "",
            name: "",
            surname: "",
            email: "",
            password: "",
            repeat_password: "",
            user_registration_token: "",
        },
    });

    function onValidSubmit(data: z.infer<typeof register_schema>) {
        if (data.password !== data.repeat_password) {
            showErrorToast("Password field error", "The passwords should be equal!");

            return;
        }

        const encryptedPassword = encryptWithPublicKey(data.password);
        const encryptedToken = encryptWithPublicKey(data.user_registration_token);

        signIn("credentials", {
            redirect: true,
            redirectTo: "/auth/login",
            register: {
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: encryptedPassword,
                user_registration_token: encryptedToken,
            }
        });
    }

    function onInvalidSubmit(errors: FieldErrors<{ username: string, name: string, surname: string, email: string; password: string, repeat_password: string, user_registration_token: string }>) {
        if (errors.username) {
            showErrorToast("Username field error", errors.username.message!);
        } else if (errors.name) {
            showErrorToast("Name field error", errors.name.message!);
        } else if (errors.surname) {
            showErrorToast("Surname field error", errors.surname.message!);
        } else if (errors.email) {
            showErrorToast("Email field error", errors.email.message!);
        } else if (errors.password) {
            showErrorToast("Password field error", errors.password.message!);
        } else if (errors.repeat_password) {
            showErrorToast("Repeat password field error", errors.repeat_password.message!);
        } else if (errors.user_registration_token) {
            showErrorToast("User registration token field error", errors.user_registration_token.message!);
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
                            <CardTitle className="text-2xl">Register</CardTitle>
                            <CardDescription>
                                Enter your the details to create a new account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form { ... form }>
                                <form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}>
                                    <div className="flex flex-col gap-6">
                                        <FormField control={form.control} name="username" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <Label htmlFor="username">Username</Label>
                                                <FormControl>
                                                    <Input id="username" type="text" content={field.value} onChange={field.onChange} required />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <Label htmlFor="name">Name</Label>
                                                <FormControl>
                                                    <Input id="name" type="text" content={field.value} onChange={field.onChange} required />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="surname" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <Label htmlFor="surname">Surname</Label>
                                                <FormControl>
                                                    <Input id="surname" type="text" content={field.value} onChange={field.onChange} required />
                                                </FormControl>
                                            </FormItem>
                                        )} />
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
                                                <Label htmlFor="password">Password</Label>
                                                <FormControl>
                                                    <Input id="password" type="password" content={field.value} onChange={field.onChange} required />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="repeat_password" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <Label htmlFor="repeat_password">Repeat Password</Label>
                                                <FormControl>
                                                    <Input id="repeat_password" type="password" content={field.value} onChange={field.onChange} required />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="user_registration_token" render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <Label htmlFor="user_registration_token">User Registration Token</Label>
                                                <FormControl>
                                                    <Input id="user_registration_token" type="text" content={field.value} onChange={field.onChange} required />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <Button type="submit" className="w-full">
                                            Create Account
                                        </Button>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Already have an account?{" "}
                                        <a href="#" className="underline underline-offset-4">
                                        Login
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