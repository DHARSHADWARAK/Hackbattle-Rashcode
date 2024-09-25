import React from 'react'
const Signup = () => {
  const TITLE="SIGN UP";
  return (
    <>
    <section className="font-suse text-md p-4 md:p-6 text-lg">
      <div className="text-3xl font-black text-gray-400 pb-2">{TITLE}</div>
      <div className='flex items-center justify-center'>
      <div className="min-h-screen  flex justify-center items-center">
      <div className="bg-black bg-opacity-75 p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-lg mb-6 text-center font-bold">Register</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Your Email
            </label>
            <input type="email" id="email" className="mt-1 p-2 w-full rounded-md bg-opacity-50 bg-white text-black" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Your Password
            </label>
            <input type="password" id="password" className="mt-1 p-2 w-full rounded-md bg-opacity-50 bg-white text-black" />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input type="password" id="confirm-password" className="mt-1 p-2 w-full rounded-md bg-opacity-50 bg-white text-black" />
          </div>
          <button type="submit" className="w-full p-3 bg-green-700 hover:bg-green-800 rounded-md font-bold">Register</button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="/login" className="hover:underline">Already Create an Account? Login</a>
        </div>
      </div>
    </div>
      </div>
    </section>
    </>
  )
}

export default Signup