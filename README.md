```
npm install
npm run dev
```

```
open http://localhost:3000
```

<!--
export const userRelations = relations(users, ({ many }) => ({
  projects: many(projects, {
    relationName: "userProjects",
    fields: [users.id],
    references: [projects.assigned_to],
  }),
})); -->




