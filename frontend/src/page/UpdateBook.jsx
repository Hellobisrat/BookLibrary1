import { useBookStore } from "../store/bookStore"
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

const UpdateBook =()=>{

  const [image,setImage]= useState("");
  const [title,setTitle]= useState(" ");
  const [subtitle,setSubtitle]= useState(" ");
  const [author, setAuthor]= useState(" ");
  const [link, setLink]= useState(" ");
  const [review, setReview]= useState(" ");
  const {isLoading, error, updateBook,fetchBook,book} = useBookStore();
  const navigate = useNavigate();
  const params = useParams();

   useEffect(()=>{
    fetchBook(params.id)
  },[fetchBook,params])
 
  useEffect(()=>{
    setTitle(book.title);
    setSubtitle(book.subtitle);
    setAuthor(book.author);
    setLink(book.link)
    setReview(book.review)
  },[book])
    const handleImageChange = (e)=>{
    const file = e.target.files[0];
    if(file){
       const reader = new FileReader(); // ✅ Declare the reader
    reader.onloadend = () => {
      setImage(reader.result); // this sets the base64 image
    };
    reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!title || !author || !link){
      toast.error("Please fill in required information.")
      return;
    } 
    const {message}= await updateBook(
      params.id,
      image,
      title,
      author,
      link,
      review
    )
    toast.success(message);
    navigate('/')
  
  }
   return(
    <div className="min-h-screen text-[#252422] bg-[#f5f5f5] 
       px-4 md:px-12 pb-16">
      <h2 className="text-center font-semibold pt-8 text-xl 
      md:text-2xl w-full mx-auto">
        Update Book
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mx-auto 
        flex flex-col justify-center items-center 
        space-y-4 mt-5 md:mt-10">
          <div className="flex flex-col w-full">
            <label className="md:text-lg">Book Image*:</label>
            <input
             type="file"
             accept="image/*:"
             onChange={handleImageChange}
             className="w-full px-3 py-1.5 md:py-2 text-[#252422]
             rounded-lg bg-white border border-gray-500"/>
          </div>
          <div className="flex flex-col w-full">
            <label className="md:text-lg">Title*:</label>
            <input
             type="text"
             value={title}
             onChange={(e)=>setTitle(e.target.value)}
             className="w-full px-3 py-1.5 md:py-2 text-[#252422]
             rounded-lg bg-white border border-gray-500"/>
          </div>
           <div className="flex flex-col w-full">
            <label className="md:text-lg">Subtitle (optional):</label>
            <input
             type="text"
             value={subtitle}
             onChange={(e)=>setSubtitle(e.target.value)}
             className="w-full px-3 py-1.5 md:py-2 text-[#252422]
             rounded-lg bg-white border border-gray-500"/>
          </div>
          <div className="flex flex-col w-full">
            <label className="md:text-lg">Author*:</label>
            <input
             type="text"
             value={author}
             onChange={(e)=>setAuthor(e.target.value)}
             className="w-full px-3 py-1.5 md:py-2 text-[#252422]
             rounded-lg bg-white border border-gray-500"/>
          </div>
          <div className="flex flex-col w-full">
            <label className="md:text-lg">Link*:</label>
            <input
             type="text"
             value={link}
             onChange={(e)=>setLink(e.target.value)}
             className="w-full px-3 py-1.5 md:py-2 text-[#252422]
             rounded-lg bg-white border border-gray-500"/>
          </div>
          <div className="flex flex-col w-full">
            <label className="md:text-lg">Personal Review (optional):</label>
            <input
             type="text"
             value={review}
             onChange={(e)=>setReview(e.target.value)}
             className="w-full px-3 py-1.5 md:py-2 text-[#252422]
             rounded-lg bg-white border border-gray-500"/>
          </div>
          {error && <p className="text-red-500">{error}</p>}
           <button
         type="submit"
         disabled={isLoading}
         className="w-full bg-[#403D39] text-[#FFFCF2] py-2 font-medium rounded-lg">
          {isLoading ? "Please wait ...":"Update Book"}
         </button>
        </form>
       
       </div>
   )
}

export default UpdateBook;