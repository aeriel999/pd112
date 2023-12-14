import React, { useEffect, useState } from 'react';
import { Table, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import '/node_modules/antd/dist/reset.css';
//import http_common from "../http_common.ts";
import axios from "axios";

interface ICategoryItem {
    key: React.Key;
    id: number;
    name: string;
    description: string;
}

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
];

export const fetchData = async () => {
    // eslint-disable-next-line no-useless-catch
    try {

        //const response= await http_common.get("/api/categories");
        const response= await axios.get("http://pd112.tanmos.com/api/categories");


        return response.data; // Optionally return the data
    } catch (error) {

        throw error; // Optionally rethrow the error
    }
};
const GetCategories: React.FC = () => {
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
            <Table columns={columns} rowKey={"id"} dataSource={data} size="middle" />

        </div>
    );

};

export default GetCategories;


