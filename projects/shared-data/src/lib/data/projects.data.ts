import { Project } from '../models/project.model';
import projectsData from './projects.json';

/**
 * Portfolio projects — canonical source of truth lives in `projects.json` so it
 * can be edited by the admin app / local backend and read at runtime by the
 * portfolio (see ProjectsService). This typed export is the compiled-in
 * snapshot used as a fallback when the runtime fetch is unavailable.
 */
export const PROJECTS: Project[] = (projectsData as Project[])
  .slice()
  .sort((a, b) => a.order - b.order);
