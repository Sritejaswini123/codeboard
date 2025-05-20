import { count, eq ,asc, and} from "drizzle-orm";
import db from "../database/db";
import { NewProject, projects} from "../database/schemas/projects";
import { users } from "../database/schemas/users";
import { user_projects } from "../database/schemas/userProjects";



//all projects
export const getAllProjects = async (
  page: number,
  page_size: number,
  user_id:number,
  project_id:number
) => {
  const offset = (page - 1) * page_size;

  const conditions = [];

  if (user_id) {
    conditions.push(eq(users.id, user_id));
  }
if (project_id){
  conditions.push(eq(projects.id,project_id));
}
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;


  const projectData = await db
    .select({
      project_id: projects.id,
      project_name: projects.title,
      user_id: users.id,
      user_name: users.first_name,
      user_email: users.email,
    })
    .from(projects)
    .innerJoin(user_projects, eq(projects.id, user_projects.project_id))
    .innerJoin(users, eq(users.id, user_projects.user_id))
    .where(whereClause)
    .orderBy(asc(projects.id))
    .limit(page_size)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: count() })
    .from(projects);

  const totalPages = Math.ceil(total / page_size);

  return {
    total_records: total,
    page,
    page_size,
    totalPages,
    next_page: page < totalPages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
    data: projectData,
  };
};


//check project exist or not
export const isProjectExist = async (title: string) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.title, title))
    return existingProject;
}


//check if project is existing with id
export const deletedProjectById=async(projectId:number)=>{
    const result=await db
        .select()
        .from(projects)
        .where(eq(projects.id,projectId));
    return result[0];
}