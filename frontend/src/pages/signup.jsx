import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log('handleSignup called');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        try {
            console.log('About to call signup...');
            await signup({ first_name: firstName, surname, email, password });
            console.log('Signup successful');
            navigate('/');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="w-full">
            <Card className="max-w-lg mx-auto my-8">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup}>
                        <div className="flex flex-col gap-6">
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="surname">Surname</Label>
                                <Input
                                    id="surname"
                                    type="text"
                                    placeholder="Doe"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input 
                                    id="confirmPassword" 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            <Button type="submit" className="w-full cursor-pointer">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button 
                        variant="outline" 
                        className="w-full cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Already have an account? Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}