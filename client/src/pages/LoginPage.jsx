import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from './../UserContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);
    const [loginError, setLoginError] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [newUser, setNewUser] = useState(false);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login', { email, password });
            const data = response.data;

            if (data === 'not found') {
                setNewUser(true);
                setLoginError(true);
            } else if (data === 'pass not ok') {
                setIncorrectPassword(true);
                setLoginError(true);
            } else {
                setUser(data);
                alert('Login successful');
                setRedirect(true);
            }
        } catch (e) {
            setLoginError(true);
        } finally {
            setEmail('');
            setPassword('');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="mt-10 grow flex items-center justify-around ">
            <div className="-mb-6 shadow-2xl px-8 py-8 max-w-full max-h-full">
                <h1 className="text-4xl text-center mb-4 font-semibold">Login</h1>
                {loginError && (
                    <div className="text-red-500 mb-2 font-bold">
                        {newUser ? 'New user, register first' : (incorrectPassword ? 'Incorrect password' : 'Login failed')}
                    </div>
                )}
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                    />
                    <button className="mt-2 primary" type="submit">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet?{" "}
                        <Link className="mt-2 underline text-black" to={"/register"}>
                            Register now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
