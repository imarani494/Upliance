
import { Routes, Route, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import FormCreator from "./components/FormCreator";
import FormRenderer from "./components/FormRenderer";
import MyForms from "./components/MyForms";
import Preview from "./components/Preview";

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Upliance — Form Builder
          </Typography>
          <Button color="inherit" component={Link} to="/create">
            Create
          </Button>
          <Button color="inherit" component={Link} to="/preview">
            Preview
          </Button>
          <Button color="inherit" component={Link} to="/myforms">
            My Forms
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<FormCreator />} />
          <Route path="/create" element={<FormCreator />} />
          <Route path="/preview" element={<FormRenderer />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </>
  );
}
