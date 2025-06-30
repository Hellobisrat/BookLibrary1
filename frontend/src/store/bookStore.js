import { create } from "zustand";
import axios from "axios";

const API_URL ="http://localhost:5000/api";

axios.defaults.withCredentials = true;

export const useBookStore = create((set)=>({
  book:null,
  books:[],
  isLoading:false,
  error:null,
  message:null,

  addBook: async(image,title , subtitle , author , link , review )=>{
    set({isLoading:true , error:null, message:null})

    try {
      const response = await axios.post(`${API_URL}/add-book`,{
        image,
        title,
        subtitle,
        author,
        link,
        review
      });
      const {message,book} = response.data
      set({book,message,isLoading:false})
      return {message,book}
    } catch(error){
      set({
        isLoading:false,
        error:error.response.data.message
                   
        
      });
      throw error;
      
    }
  }
  
}))