import React, { useContext, useState } from "react"
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from "../context/AuthContext"
import axios from "axios"
import { userDataContext } from "../context/UserContext"

function Login() {
  const [show, setShow] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { setUserData } = useContext(userDataContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr("")

    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      )

      setUserData(result.data)
      navigate("/")
      setEmail("")
      setPassword("")
    } catch (error) {
      console.log("LOGIN ERROR:", error)

      setErr(
        error?.response?.data?.message ||
          error.message ||
          "Login failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-start gap-[10px]">
      <div className="p-[30px] lg:p-[35px] w-full h-[80px] flex items-center">
        <img src={logo} alt="" />
      </div>

      <form
        className="w-[90%] max-w-[400px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px]">
          Sign In
        </h1>

        <input
          type="email"
          placeholder="email"
          required
          className="w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-[50px] border-2 border-gray-600 rounded-md relative">
          <input
            type={show ? "text" : "password"}
            placeholder="password"
            required
            className="w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer font-semibold"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? "hidden" : "show"}
          </span>
        </div>

        {err && <p className="text-center text-red-500">*{err}</p>}

        <button
          className="w-full h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className="text-center cursor-pointer" onClick={() => navigate("/signup")}>
          want to create a new account ?{" "}
          <span className="text-[#2a9bd8]">Sign Up</span>
        </p>
      </form>
    </div>
  )
}

export default Login
