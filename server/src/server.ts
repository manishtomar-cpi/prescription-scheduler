import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // logger will be added - using console for now
  console.log(`Server is running on port ${PORT}`);
});
