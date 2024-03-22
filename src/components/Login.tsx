

export const Login = () => {
  return (
    <div className="flex flex-col py-4 border border-black w-[360px] h-[517px] mx-28">
        <h1 className="font-main font-extrabold">NFT Access</h1>
        <p>Please fill your detail to access your account.</p>
        {/* input for email */}
        <label htmlFor="">Email</label>
        <div className="">
            <div className="relative w-full min-w-[200px] h-10">
                <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
                    <img src="src\assets\X Icon.png" alt="" />
                </div>
                <input
                    type="email"
                    className="w-full h-full bg-transparent text-blue-gray-700 
                    font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 
                    disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 
                    placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] !pr-9 border-blue-gray-200 focus:border-gray-900"
                    placeholder="debra.holt@example.com" 
                />  
            </div>
        </div> 
        {/* input for password */}
        <label className="font-main font-medium">Password</label>
        <div className="">
            <div className="relative w-full min-w-[200px] h-10">
                <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
                    <img src="src\assets\Hide Icon.svg" alt="" />
                </div>
                <input
                    type="password"
                    className="w-full h-full bg-transparent text-blue-gray-700 
                    font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 
                    disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 
                    placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] !pr-9 border-blue-gray-200 focus:border-gray-900"
                    placeholder="debra.holt@example.com" 
                />  
            </div>
        </div> 
        <button>Forgot Passworld?</button>
        <button>sign in</button>
        <button className="border border-black">
            <img src="src\assets\Google.png" alt="" />
            Sign in with google
        </button>
        <div className="flex flex-row gap-4">
            <p>Don't have an account?</p>
            <button>Sign up</button>
        </div>
    </div>
  )
}
