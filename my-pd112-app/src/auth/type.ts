import {UploadFile} from "antd/es/upload/interface";

export interface IRegisterForm {
    lastName: string,
    name: string,
    phone: string,
    password: string,
    password_confirmation: string,
    image: UploadFile|null
}

export interface IRegister {
    lastName: string,
    name: string,
    phone: string,
    password: string,
    password_confirmation: string,
    image: string
}

export interface ILogin {
    email: string,
    password: string,
}

export interface IUser {
    lastName: string,
    email: string;
    name: string,
    phone: string,
    password: string,
    image: string
}