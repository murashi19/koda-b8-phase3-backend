import swaggerJsdoc from "swagger-jsdoc";

const PORT = process.env.PORT || 8080;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Shortlink API",
      version: "1.0.0",
      description:
        "REST API untuk aplikasi shortlink. Ada auth pakai JWT, lalu user yang sudah login bisa bikin short link dengan slug custom atau auto-generated. List link dan detail dashboard di-cache di Redis.",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server",
      },
    ],
    tags: [
      { name: "Auth", description: "Register dan login" },
      { name: "Links", description: "Kelola short link (butuh login)" },
      { name: "Redirect", description: "Redirect publik dari slug ke original URL" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Link: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            original_url: {
              type: "string",
              example: "https://example.com/artikel-panjang",
            },
            slug: { type: "string", example: "artikel-saya" },
            short_url: {
              type: "string",
              example: "http://localhost:8080/artikel-saya",
            },
            created_at: { type: "string", format: "date-time" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
