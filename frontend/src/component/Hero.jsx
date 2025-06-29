import React from 'react'
import BgVideo from '../asset/BgVideo.mp4'// sample video from https://www.pixels.com/search/videos/book/
const Hero = () => {
  return (
    <div className='relative w-full h-[75vh] lg:h-[90vh] text-[#FFFCF2]
    px-4 md:px-12 overflow-hidden'>
      {/*background overlay */}
      <div className='bg-[#252422] w-full h-full absolute top-0 left-0
      opacity-80 -z-10'></div>
      <div className='absolute insert-0 -z-20'>
        <video
        className='object-cover object-center w-full h-full
        autoplay loop muted'>
          <source src={BgVideo} type='video/mp4'/>
        </video>
      </div>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <h1 className='text-3xl md:text-4xl lg:text-6xl pb-8 
        lg:pb-12 text-center max-w-5xl'>
           Share Your <span className='text-[#EB5E28]'>favorite</span>
           books and {" "}
           <span className='text-[#EB5E28]'>explore</span>new w=ones 
           from readers like you.
          </h1> 
          <form className='relative w-full max-w-sm md:max-w-xl lg:max-w-3xl'>
           <input 
            type='text'
            placeholder='e.g. Purple hibiscus'
            className='w-full px-3 py-1.5 md:py-2 text-[#252422]
            rounded-lg placeholder:text-gray-600 bg-[#FFFCF2]'/>
            <button
            type='submit'
            className='absolute right-0 top-0 bottom-0 
            bg-[#403D39] px-4 rounded-r-lg'>
              Search
            </button>
          </form>   
      </div>
    </div>
  )
}

export default Hero