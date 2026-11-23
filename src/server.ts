import { app } from "./app.js";

// Fixed for now. Validated env config replaces it in #4.
const port = 3000;

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Server listening on port ${port}`);
});
