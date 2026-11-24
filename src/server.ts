import { app } from "./app.js";
import { parseEnv } from "./config/env.js";

const env = parseEnv(process.env);

app.listen(env.PORT, (error) => {
  if (error) throw error;
  console.log(`Server listening on port ${env.PORT}`);
});
