import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevsWebs API",
      version: "1.0.0",
      description: "REST API for the DevsWebs developer community platform",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development",
      },
      {
        url: "https://devswebs-production.up.railway.app",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
        Blog: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            content: { type: "string" },
            category: { type: "string" },
            difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
            tags: { type: "array", items: { type: "string" } },
            coverImage: { type: "string" },
            status: { type: "string", enum: ["draft", "published"] },
            readTime: { type: "number" },
            views: { type: "number" },
            likes: { type: "array", items: { type: "string" } },
            author: { $ref: "#/components/schemas/AuthorSummary" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AuthorSummary: {
          type: "object",
          properties: {
            _id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            userName: { type: "string" },
            pictures: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            username: { type: "string" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            total: { type: "number" },
            page: { type: "number" },
            limit: { type: "number" },
            totalPages: { type: "number" },
            hasNextPage: { type: "boolean" },
            hasPrevPage: { type: "boolean" },
          },
        },
      },
    },
  },
  apis: ["./backend/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
