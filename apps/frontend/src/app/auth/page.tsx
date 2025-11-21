'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from 'packages/ui'
import { Input } from 'packages/ui'
import { Button } from 'packages/ui'
import { Label } from 'packages/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'packages/ui'
import { Alert, AlertDescription } from 'packages/ui'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from 'packages/ui'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from 'lucide-react'
const API_URL = 'http://localhost:4000/auth'
import { useSearchParams } from 'next/navigation'


export default function AuthPage(requireAuth: boolean = true) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [activeTab, setActiveTab] = useState('login')
    const [message, setMessage] = useState({ type: '', text: '' })
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [signupData, setSignupData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const params = useSearchParams()

    useEffect(() => {
        const token = params.get('token')

        if (token) {
            console.log('Token Received:', token)
            localStorage.setItem('token', token)

            window.location.href = '/chat'
        }
    }, [])

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (requireAuth && !token) {
            return
        }

        if (requireAuth && token) {
            router.push('/chat')
        }
    }, [requireAuth])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (!loginData.email || !loginData.password) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return
        }

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            })

            const data = await res.json()

            if (!res.ok) {
                setMessage({
                    type: 'error',
                    text: data.message || 'Login failed',
                })
                return
            }

            // Save token
            localStorage.setItem('token', data.token)

            setMessage({ type: 'success', text: 'Login successful!' })
            setTimeout(() => {
                window.location.href = '/chat'
            }, 1000)
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong' })
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (
            !signupData.name ||
            !signupData.username ||
            !signupData.email ||
            !signupData.password
        ) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return
        }

        if (signupData.password !== signupData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return
        }

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signupData.name,
                    username: signupData.username,
                    email: signupData.email,
                    password: signupData.password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setMessage({
                    type: 'error',
                    text: data.message || 'Signup failed',
                })
                return
            }

            setMessage({
                type: 'success',
                text: 'Account created successfully!',
            })

            setTimeout(() => {
                setActiveTab('login')
                setMessage({ type: '', text: '' })
            }, 1500)
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong' })
        }
    }

    // Discord Icon Component
    const DiscordIcon = () => (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    )

    // X Icon Component
    const XIcon = () => (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold tracking-tight">
                        Welcome
                    </h1>
                    <p className="text-muted-foreground">
                        Sign in to your account or create a new one
                    </p>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="mb-4 grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    {message.text && (
                        <Alert
                            className={`${
                                message.type === 'success'
                                    ? 'border-green-500/50 bg-green-500/10 text-green-500'
                                    : 'border-destructive/50 bg-destructive/10 text-destructive'
                            }`}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                    )}

                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Enter your credentials to access your
                                    account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10"
                                            value={loginData.email}
                                            onChange={(e) =>
                                                setLoginData({
                                                    ...loginData,
                                                    email: e.target.value,
                                                })
                                            }
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' &&
                                                handleLogin(e)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="••••••••"
                                            className="px-10"
                                            value={loginData.password}
                                            onChange={(e) =>
                                                setLoginData({
                                                    ...loginData,
                                                    password: e.target.value,
                                                })
                                            }
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' &&
                                                handleLogin(e)
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <Button
                                    onClick={handleLogin}
                                    className="w-full"
                                >
                                    Login
                                </Button>
                                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                    Or continue with
                                </FieldSeparator>
                                <Field className="grid grid-cols-3 gap-4">
                                    <Button variant="outline" type="button">
                                        <XIcon />
                                        <span className="sr-only">
                                            Login with X
                                        </span>
                                    </Button>
                                    <Button variant="outline" type="button">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span className="sr-only">
                                            Login with Google
                                        </span>
                                    </Button>
                                    <Button variant="outline" type="button">
                                        <DiscordIcon />
                                        <span className="sr-only">
                                            Login with Discord
                                        </span>
                                    </Button>
                                </Field>
                            </CardContent>
                            {/* <CardFooter></CardFooter> */}
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create an account</CardTitle>
                                <CardDescription>
                                    Enter your information to get started
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="John Doe"
                                            className="pl-10"
                                            value={signupData.name}
                                            onChange={(e) =>
                                                setSignupData({
                                                    ...signupData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">
                                        Username
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-username"
                                            type="text"
                                            placeholder="z3i8"
                                            className="pl-10"
                                            value={signupData.username}
                                            onChange={(e) =>
                                                setSignupData({
                                                    ...signupData,
                                                    username: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10"
                                            value={signupData.email}
                                            onChange={(e) =>
                                                setSignupData({
                                                    ...signupData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="••••••••"
                                            className="px-10"
                                            value={signupData.password}
                                            onChange={(e) =>
                                                setSignupData({
                                                    ...signupData,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm-password">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="••••••••"
                                            className="px-10"
                                            value={signupData.confirmPassword}
                                            onChange={(e) =>
                                                setSignupData({
                                                    ...signupData,
                                                    confirmPassword:
                                                        e.target.value,
                                                })
                                            }
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' &&
                                                handleSignup(e)
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleSignup}
                                    className="w-full"
                                >
                                    Create Account
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>By creating an account, you agree to our</p>
                    <div className="flex justify-center gap-1">
                        <button className="text-primary hover:underline">
                            Terms of Service
                        </button>
                        <span>and</span>
                        <button className="text-primary hover:underline">
                            Privacy Policy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
