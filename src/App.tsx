import { Login } from "./components/Login"

function App() {

  return (
    <>
    <div className="h-screen flex w-screen px-8 py-8 border justify-center">
        <img src="src\assets\Logo.png" alt="company-logo" className="border border-red-50 absolute top-10 left-10 " />
        <div className="flex flex-row items-center border">
          <Login /> 
          <img src="src\assets\DRIP_20.png" alt="" className="w-[768px] h-[896px] bg-indigo-100 rounded-3xl" />
        </div>
    </div>
    </>
  )
}

export default App
