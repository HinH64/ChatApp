import {useState} from 'react'
import GenderCheckbox from './GenderCheckbox'
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
    const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});
    const { loading, signup } = useSignup();

    const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

    const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};
  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto bg-base-100 rounded-lg'>
        <div className='w-full p-6 shadow-md bg-clip-padding backdrop-filter '>
            <h1 className='text-3xl font-semibold text-center'>
                Sign Up
                <span className='text-blue-500'> ChatApp</span>
            </h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Full Name</span>
                    </label>
                    <input type="text" placeholder='Enter Full Name' className='w-full input input-bordered h-10' 
                    value={inputs.fullName} 
                    onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                    />
                </div>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Username</span>
                    </label>
                    <input type="text" placeholder='Enter Username' className='w-full input input-bordered h-10' 
                    value={inputs.username}
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    />
                </div>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Password</span>
                    </label>
                    <input type="password" placeholder='Enter Password' className='w-full input input-bordered h-10' 
                    value={inputs.password}
                     onChange={(e) => setInputs({ ...inputs, password: e.target.value })}/>
                </div>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Confirm Password</span>
                    </label>
                    <input type="password" placeholder='Confirm Password' className='w-full input input-bordered h-10' 
                    value={inputs.confirmPassword}
                    onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                    />
                </div>
                <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
            
                <div className="form-control mt-6">
                    <button className='btn btn-accent' disabled={loading}>
							{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
					</button>
                </div>
                <div className='divider px-3'>OR</div>
                    <Link to='/login' className="form-control mt-6">
                        <button className='btn btn-primary'>
                                Login
                        </button>
                    </Link>     
            </form>
        </div>
    </div>
  )
}

export default SignUp