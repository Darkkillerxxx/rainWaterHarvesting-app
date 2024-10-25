import axios from "axios";

export const callAPI = async(url,method,payload,token) =>{
    try{
        let apiResponse;
        switch(method){
            case 'GET':
                apiResponse = await axios.get(url, {
                    headers: {
                        authorization: `Bearer ${token}` 
                    }
                });
                break;
            case 'POST':
                apiResponse = await axios.post(url,payload,
                    {
                        headers: {
                            authorization: `Bearer ${token}` 
                        }
                    }
                );
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
