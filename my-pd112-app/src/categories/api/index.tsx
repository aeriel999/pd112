import http_common from "../../http_common.ts";
import {ICategoryCreate, ICategoryEdit} from "../type.ts";

export  const fetchData = async () => {
    try {
        const response= await http_common.get("/api/categories");
        //const response= await axios.get("http://pd112.tanmos.com/api/categories");
        console.log(response.data);

        return response.data; // Optionally return the data
    } catch (error) {

        throw error; // Optionally rethrow the error
    }
};

export async function addCategory(model: ICategoryCreate)  {
    try {
        const response = await http_common.post("/api/categories/add", model,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.status;
    }
    catch (error) {
        throw error;
    }
}
export async function fetchCategoryDetails(categoryId: number)  {
    try {
        const response = await http_common.get(`/api/categories/get/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category details:', error);
        throw error;
    }
}

export async function updateCategory(categoryId : number, fetchCat : ICategoryEdit) {
    console.log("categoryId", categoryId);

    console.log("fetchCat", fetchCat);
    try {
        const response = await http_common.post(`/api/categories/update/${categoryId}`, fetchCat,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        // Assuming the response data is in JSON format
        return response.status;
    } catch (error) {
        console.error('Error fetching category details:', error);
        throw error;
    }
}

export async function deleteCategory(categoryId : number)
{
    try {
        const response = await http_common.post(`/api/categories/delete/${categoryId}`);

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        // Assuming the response data is in JSON format
        return response.status;
    } catch (error) {
        console.error('Error fetching category details:', error);
        throw error;
    }
}