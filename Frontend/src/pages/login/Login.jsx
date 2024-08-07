import { Link } from "react-router-dom";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

    const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto bg-base-100 rounded-lg'>
        <div className='w-full p-6 shadow-md bg-clip-padding backdrop-filter  '>
            <h1 className='text-3xl font-semibold text-center'>
                Login
                <span className='text-blue-500'> ChatApp</span>
            </h1>

            <form onSubmit={handleSubmit} >
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Username</span>
                    </label>
                    <input type="text" placeholder='Enter Username' className='w-full input input-bordered h-10'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Password</span>
                    </label>
                    <input type="password" placeholder='Enter Password' className='w-full input input-bordered h-10'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="form-control mt-6">
                    <button className='btn btn-primary ' disabled={loading}>
							{loading ? <span className='loading loading-spinner'></span> : "Login"}
					</button>
                </div>
                <div className='divider px-3'>OR</div>
                    <Link to='/signup' className="form-control mt-6">
                        <button className='btn btn-accent'>
                                Sign Up
                        </button>
                    </Link>     
            </form>
        </div>
    </div>
  )
}

export default Login