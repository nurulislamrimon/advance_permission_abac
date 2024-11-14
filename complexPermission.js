const ROLES = {
  admin: {
    comments: {
      view: true,
      create: true,
      update: true,
      delete: (user, comment) => user.id === comment.userId,
    },
    todo: {
      view: true,
      create: true,
      update: true,
      delete: (user, todo) => user.id === todo.userId,
    },
  },
  moderator: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todo: {
      view: true,
      create: true,
      update: true,
    },
  },
  user: {
    comments: {
      view: true,
      create: true,
    },
    todo: {
      view: true,
      create: true,
    },
  },
};

const isOwner = () => {};

export const hasPermission = (user, resource, action, data) => {
  return user.roles.some((role) => {
    const permission = ROLES[role][resource]?.[action];
    if (permission === null) return false;
    if (permission === true || permission === false) return permission;

    return data !== null && permission(user, data);
  });
};

console.log(
  hasPermission({ id: 1, roles: ["admin"] }, "comments", "delete", {
    userId: 1,
  })
);
