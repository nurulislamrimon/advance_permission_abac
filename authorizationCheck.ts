/* eslint-disable @typescript-eslint/no-explicit-any */
interface User {
  department: string;
  role: string;
  attributes: Record<string, any>;
}

interface Resource {
  type: string;
  owner: string;
  classification: string;
  attributes: Record<string, any>;
}

interface Environment {
  time: string;
  location: string;
  device: string;
  attributes: Record<string, any>;
}

export interface Policy {
  conditions: Record<string, any>;
  actions: string[];
  effect: "ALLOW" | "DENY";
}
export function evaluatePolicy(
  user: User,
  resource: Resource,
  environment: Environment,
  action: string,
  policies: Policy[]
): boolean {
  for (const policy of policies) {
    const isActionAllowed = policy.actions.includes(action);
    const isConditionMet = Object.entries(policy.conditions).every(
      ([key, value]) => {
        const [entity, attribute] = key.split(".");

        let entityValue: any;

        // Type-safe access to the entity properties
        if (entity === "user" && attribute in user) {
          entityValue = (user as any)[attribute];
        } else if (entity === "resource" && attribute in resource) {
          entityValue = (resource as any)[attribute];
        } else if (entity === "environment" && attribute in environment) {
          entityValue = (environment as any)[attribute];
        } else {
          return false; // Condition key doesn't match any entity
        }

        // Evaluate condition value
        if (typeof value === "object" && value.between) {
          return (
            entityValue >= value.between[0] && entityValue <= value.between[1]
          );
        }
        return entityValue === value;
      }
    );

    if (isActionAllowed && isConditionMet) {
      return policy.effect === "ALLOW";
    }
  }

  return false; // Deny if no policies allow the action
}

// Example Usage
const user = { department: "Finance", role: "Manager", attributes: {} };
const resource = {
  type: "Financial Report",
  owner: "user-123",
  classification: "Confidential",
  attributes: {},
};
const environment = {
  time: "14:00",
  location: "US",
  device: "Desktop",
  attributes: {},
};

const policies: Policy[] = [
  {
    conditions: {
      "user.department": "Finance",
      "resource.type": "Financial Report",
      "environment.time": { between: ["09:00", "17:00"] },
    },
    actions: ["read"],
    effect: "ALLOW",
  },
];

const isAuthorized = evaluatePolicy(
  user,
  resource,
  environment,
  "read",
  policies
);
console.log(isAuthorized ? "Access Granted" : "Access Denied");
