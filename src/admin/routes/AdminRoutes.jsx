import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";

import AdminUsers from "../pages/AdminUsers";
import AdminCategories from "../pages/AdminCategories";
import AdminProjects from "../pages/AdminProjects";
import AdminProjectRoles from "../pages/AdminProjectRoles";
import AdminSidemenu from "../pages/AdminSidemenu";
import AdminRolePermissions from "../pages/AdminRolePermissions";
import AdminUserProjectRole from "../pages/AdminUserProjectRole";

export default function AdminRoutes() {

    return (
        <Routes>

            <Route element={<AdminLayout />}>

                <Route path="users" element={<AdminUsers />} />

                <Route path="categories" element={<AdminCategories />} />

                <Route path="projects" element={<AdminProjects />} />

                <Route path="project-roles" element={<AdminProjectRoles />} />

                <Route path="sidemenu" element={<AdminSidemenu />} />

                <Route path="role-permissions" element={<AdminRolePermissions />} />

                <Route path="user-project-role" element={<AdminUserProjectRole />} />

            </Route>

        </Routes>
    );
}