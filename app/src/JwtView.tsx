import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import DraftsIcon from "@mui/icons-material/Drafts";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { boxStyle } from "./const";
import { getEmail, getExpirationTime, getIdToken, getUserName } from "./util";

export default function JwtView(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [expirationTime, setExpirationTime] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const idToken = await getIdToken();
      if (idToken) {
        setEmail(getEmail(idToken));
        setExpirationTime(getExpirationTime(idToken));
        setUserName(getUserName(idToken));
      }
    })();
  }, []);

  return (
    <>
      <Box sx={boxStyle}>
        <List>
          {renderListItem(<PersonOutline />, "UserName", userName)}
          {renderListItem(<DraftsIcon />, "Email", email)}
          {renderListItem(
            <AccessTimeIcon />,
            "Expiration Time",
            expirationTime
          )}
        </List>
      </Box>
    </>
  );
}

// ListItemをレンダリングする
function renderListItem(
  icon: JSX.Element,
  primary: string,
  secondary: string
): JSX.Element {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
}
