import { useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { signOut } from "aws-amplify/auth";
import JwtView from "./JwtView";
import MfaView from "./MfaView";

export default function HomeView() {
  const navigate = useNavigate();

  // ログアウト処理
  const handleLogout = async () => {
    await signOut();
    sessionStorage.clear();
    document.cookie = "foobar=; max-age=0";
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TOTP MFA sample
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <JwtView />
      <MfaView />
    </Box>
  );
}
