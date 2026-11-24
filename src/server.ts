import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, (error) => {
  if (error) throw error;
  console.log(`Server listening on port ${env.PORT}`);
});
