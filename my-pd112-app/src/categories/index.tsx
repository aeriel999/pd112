import React, { useEffect, useState } from 'react';
import {Table, Divider, Button} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import '/node_modules/antd/dist/reset.css';
import http_common from "../http_common.ts";
import {ICategoryItem} from "./type.ts";
import {useNavigate} from "react-router-dom";

const GetCategories: React.FC = () => {
    const navigate = useNavigate();
    const BASE_URL: string = import.meta.env.VITE_API_URL as string;
    const imgURL = BASE_URL + "/upload/150_";
    const columns: ColumnsType<ICategoryItem> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (imageName: string) => (
                <img src={`${imgURL}${imageName}`} alt="Category Image"  />
            ),
        },
    ];

    const fetchData = async () => {
        // eslint-disable-next-line no-useless-catch

        try {
            const response= await http_common.get("/api/categories");
            //const response= await axios.get("http://pd112.tanmos.com/api/categories");
            console.log(response.data);

            return response.data; // Optionally return the data
        } catch (error) {

            throw error; // Optionally rethrow the error
        }
    };

    const [data, setData] = useState<ICategoryItem[]>([]);
    useEffect(() => {

        const fetchDataAndDoSomething = async () => {
            try {
                const fetchedData: ICategoryItem[] = await fetchData();
                // Update the state with the fetched data
                setData(fetchedData);
            // Do something with the data
            } catch (error) {
                // Handle errors
            }
        };

        fetchDataAndDoSomething();
    }, []); // The empty dependency array means this effect runs once when the component mounts

    return (
        <div>
            <Divider>Category list</Divider>
            <Button type="primary" onClick={() => navigate("/categories/add")} style={{ margin: '5px' }}>ADD +</Button>
            <Table columns={columns} rowKey={"id"} dataSource={data} size="middle" />
        </div>
    );
};

export default GetCategories;


