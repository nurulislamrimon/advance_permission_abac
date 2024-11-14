const ROLES = {
  admin: [
    "view:comments",
    "create:comments",
    "update:comments",
    "delete:comments",
  ],
  moderator: ["view:comments", "create:comments", "update:comments"],
  user: ["view:comments", "create:comments"],
};

export const hasPermission = (user, permission) => {
  return ROLES[user.role].includes(permission);
};

console.log(hasPermission({ role: "user" }, "delete:comments"));
