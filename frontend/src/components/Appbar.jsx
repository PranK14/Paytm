import { Link, useNavigate } from 'react-router-dom'

export const Appbar = () => {
  const navigate = useNavigate()
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4 font-bold">
        Paytm
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">Hello</div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">U</div>
        </div>
        <button
          className="bg-white-500 hover:bg-red-600 active:bg-red-400 focus:outline-none focus:ring focus:ring-violet-300 ... px-2"
          onClick={() => {
            localStorage.clear()

            navigate('/login')
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  )
}
