export interface Project {
    id: number;
    title: string;
    description: string;
    icon: string;
    link: string;
    technologies: string[];
    featured?: boolean;
    images: string[];
}
