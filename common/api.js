import axios from "axios";

export const callAPI = async(url,method,payload) =>{
    try{
        let apiResponse;
        switch(method){
            case 'GET':
                apiResponse = await axios.get(url);
                break;
            case 'POST':
                apiResponse = await axios.post(url,payload);
                break;
            default:
                break;
        }
        return apiResponse;
    }
    catch(error){
        return {
            code:500,
            message:error
        }
    }

}
