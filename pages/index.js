import { useState } from 'react'
import { supabase } from 'lib/Store'

const Home = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (type, username, password) => {
    try {
      const { error, user } =
        type === 'LOGIN'
          ? await supabase.auth.signIn({ email: username, password })
          : await supabase.auth.signUp({ email: username, password })
      // If the user doesn't exist here and an error hasn't been raised yet,
      // that must mean that a confirmation email has been sent.
      // NOTE: Confirming your email address is required by default.
      if (error) {
        alert('Error with auth: ' + error.message)
      } else if (!user) alert('Signup successful, confirmation mail should be sent soon!')
    } catch (error) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  return (
    <>
      <div className='min-h-full flex'>
        <div className='flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>Sign in to mi slack</h2>
            <div className='mt-8'>
              <div className='mt-6'>
                <div className='space-y-6'>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                      Email address
                    </label>
                    <div className='mt-1'>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                      Password
                    </label>
                    <div className='mt-1'>
                      <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <a
                      onClick={e => {
                        e.preventDefault()
                        handleLogin('SIGNUP', username, password)
                      }}
                      href={'/channels'}
                      className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-gray-100 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                      Sign up
                    </a>
                    <a
                      onClick={e => {
                        e.preventDefault()
                        handleLogin('LOGIN', username, password)
                      }}
                      href={'/channels'}
                      className='mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                      Sign in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='hidden lg:block relative w-0 flex-1'>
          <img
            className='absolute inset-0 h-full w-full object-cover'
            src='https://images.unsplash.com/photo-1435575653489-b0873ec954e2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'
            alt=''
          />
        </div>
      </div>
    </>
  )
}

export default Home
