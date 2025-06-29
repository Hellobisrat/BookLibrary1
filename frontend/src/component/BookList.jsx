import React from 'react'
import { Link } from 'react-router'

const BookList = () => {
  const books = ["","","","",""]
  return (
    <div className='text-[#252422] bg-[#f5f5f5] px-4 md:px-12 pb-20'>
      <h1 className='py-6 text-xl md:text-2xl lg:text-3xl w-full mx-auto max-w-6xl'>
        Reader&rsquo;s favorites
      </h1>
      <div className='flex flex-wrap justify-around gap-y-5 w-full max-w-6xl'>
        {books.map((_,index)=>(
          <Link key={index} to={`/book/123`}>
            <div className='shadow-sm hover:shadow-md rounded-b-md'>
              <div className='bg-[#252422] h-[12rem]'></div>
              <div className='p-2'>
                <h2 className='font-semibold'>A good book title</h2>
                <p>Jhon Doe</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
  )
}

export default BookList;