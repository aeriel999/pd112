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
