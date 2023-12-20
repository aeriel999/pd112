export interface ICategoryCreate {
    name: string;
    image: File;
    description: string;
}

export interface ICategoryItem {
    id: number;
    name: string;
    description: string;
    image: string;
}

export interface ICategoryEdit {
    name: string;
    image: File | null;
    description: string;
    isImageReload: boolean | null;
}

export  type FieldType = {
    name?: string;
    description?: string;
};
