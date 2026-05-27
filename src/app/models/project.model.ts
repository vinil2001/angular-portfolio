export interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  icon?: string;
  link?: string;
  images?: string[];
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
