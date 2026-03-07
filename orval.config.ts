import { defineConfig } from "orval";

export default defineConfig({
  boilerplate: {
    input: {
      target: "http://localhost:3010/docs-json",
    },
    output: {
      mode: "split",
      target: "src/generated/api/endpoints.ts",
      schemas: "src/generated/api/model",
      client: "react-query",
      clean: true,
      override: {
        mutator: {
          path: "src/lib/axios.ts",
          name: "customInstance",
        },
      },
    },
  },
});
