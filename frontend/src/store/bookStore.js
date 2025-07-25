import { create } from "zustand";
import axios from "axios";
const API_URL = 'https://booklibrary1-h0cq.onrender.com/api'

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
      }, { withCredentials: true });
      const {message,book} = response.data
      set({book,message,isLoading:false})
      return {message,book}
    } catch(error){
      set({
        isLoading:false,
        error:error?.response?.data?.message || error.message || "Something went wrong."
                   
        
      });
      throw error;
      
    }
  },
  fetchBooks:async()=>{
    set({isLoading:true, error:null})
    try {
      const response = await axios.get(`${API_URL}/fetch-books`, { withCredentials: true })
      set({books:response.data.books, isLoading:false})
    } catch (error) {
      set({isLoading:false,error:error.response.data.message||'Error fetching books'})
      throw error;
    }
  },
  fetchBook:async(id)=>{
    set({isLoading:true,error:null})
    try {
      const response = await axios.get(`${API_URL}/fetch-book/${id}`, { withCredentials: true })
      set({book:response.data.book,isLoading:false})
    } catch (error) {
      set({
        isLoading:false,
        error:error.response.data.message||"Error fetching book."
      });
      throw error;
      
    }
  },

  updateBook:async(id,image,title,subtitle,author,link,review)=>{
    set({isLoading:true, error:null, message:null});
    try {
      const response = await axios.post(`${API_URL}/update-book/${id}`,{
        image,
        title,
        subtitle,
        author,
        link,
        review
      }, { withCredentials: true })
      const {message,book}=response.data;
      set({book,message,isLoading:false});
      return {message, book}
    } catch (error) {
      set({
        isLoading:false,
        error:error.response.data.message || 'Error updating book.'
        
      });
      throw error;

      
    }
  },
  
  deleteBook: async (id)=>{
    set({isLoading:true, error:null, message:null})
    try {
      const response = await axios.delete(`${API_URL}/delete-book/${id}`, { withCredentials: true });
      const {message} =response.data;
      set({message,isLoading:false})
      return {message}
    } catch (error) {
      set({
        isLoading:false,
        error:error.response.data.message || "Error deleting book."
        
      });
      throw error;
      
    }
  },
  searchBooks: async (searchTerm)=>{
    set({isLoading:true, error: null});
    try {
      const response = await axios.get(`${API_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      set({books:response.data.books, isLoading:false})
      
    } catch (error) {

      set({
         isLoading:false,
      error:error.response.data.message || "Error fetching book."
      });
      throw error;
      
     
    }
  }

  
}))