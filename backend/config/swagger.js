const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "GymRoutines API",
      version: "1.0.0",
      description:
        "API REST de GymRoutines. Autenticación con JWT (`Authorization: Bearer <token>`). " +
        "Niveles de acceso: **usuario** y **admin**. Los errores devuelven `{ mensaje, errores? }`.",
    },
    servers: [{ url: "/", description: "Servidor actual" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            mensaje: { type: "string" },
            errores: { type: "array", items: { type: "string" } },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            surname: { type: "string" },
            age: { type: "integer" },
            email: { type: "string", format: "email" },
            isAdmin: { type: "boolean" },
            status: { type: "boolean", description: "false = cuenta desactivada" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ExerciseInput: {
          type: "object",
          required: ["name", "muscleGroup"],
          properties: {
            name: { type: "string", maxLength: 100 },
            description: { type: "string" },
            muscleGroup: {
              type: "string",
              enum: [
                "cuadriceps", "isquiotibiales", "gluteos", "gemelos", "pecho", "espalda",
                "hombros", "biceps", "triceps", "abdomen", "cardio",
              ],
            },
          },
        },
        Exercise: {
          allOf: [
            { $ref: "#/components/schemas/ExerciseInput" },
            {
              type: "object",
              properties: {
                id: { type: "integer" },
                isPublic: { type: "boolean", description: "true = catálogo global (creado por un admin)" },
                creatorId: { type: "integer", nullable: true },
              },
            },
          ],
        },
        ExerciseSet: {
          type: "object",
          required: ["setNumber", "reps"],
          properties: {
            setNumber: { type: "integer", minimum: 1 },
            reps: { type: "integer", minimum: 0 },
            weightKg: { type: "number", nullable: true, description: "null = peso corporal" },
          },
        },
        RoutineExerciseInput: {
          type: "object",
          required: ["exerciseId"],
          properties: {
            exerciseId: { type: "integer" },
            orderIndex: { type: "integer", minimum: 1, default: 1 },
            restSeconds: { type: "integer", minimum: 0, default: 90 },
            ExerciseSets: { type: "array", items: { $ref: "#/components/schemas/ExerciseSet" } },
          },
        },
        RoutineInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", maxLength: 100 },
            description: { type: "string" },
            RoutineExercises: { type: "array", items: { $ref: "#/components/schemas/RoutineExerciseInput" } },
          },
        },
        Routine: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            creatorId: { type: "integer" },
            creator: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                surname: { type: "string" },
              },
            },
            RoutineExercises: {
              type: "array",
              items: {
                allOf: [
                  { $ref: "#/components/schemas/RoutineExerciseInput" },
                  {
                    type: "object",
                    properties: {
                      Exercise: { $ref: "#/components/schemas/Exercise" },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")],
});

module.exports = swaggerSpec;
