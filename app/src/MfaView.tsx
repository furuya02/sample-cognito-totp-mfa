import MfaConfigrationView from "./MfaConfigrationView";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { boxStyle } from "./const";
import { getAccessToken } from "./util";

export default function MfaView(): JSX.Element {
  const [configuring, setConfiguring] = useState<boolean>(false);
  const [isEnabledMFA, setIsEnabledMFA] = useState<boolean>(false);

  function handleSwitchConfiguring(sw: boolean) {
    setConfiguring(sw);
  }

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        try {
          const isEnabledMFA = await getIsEnabledMFA(accessToken.toString());
          setIsEnabledMFA(isEnabledMFA);
        } catch (error) {
          console.log(`getIsEnabledMFA fald. ERROR:${error}`);
        }
      }
    })();
  }, []);

  return configuring ? (
    <MfaConfigrationView
      handleSwitchConfiguring={handleSwitchConfiguring}
      setIsEnabledMFA={setIsEnabledMFA}
    ></MfaConfigrationView>
  ) : (
    <Box sx={{ ...boxStyle, border: "0px" }}>
      <Box
        sx={{
          marginBottom: "10px",
          color: isEnabledMFA ? "primary.main" : "error.main",
        }}
      >
        <div>
          現在、MFAは、 {isEnabledMFA ? "アプティブ" : "非アクティブ"}{" "}
          になっています
        </div>
      </Box>
      <Button variant="contained" onClick={() => handleSwitchConfiguring(true)}>
        {/* <Button variant="contained" onClick={() => {}}> */}
        MFAを設定する
      </Button>
    </Box>
  );
}

async function getIsEnabledMFA(accessToken: string): Promise<boolean> {
  const client = new CognitoIdentityProviderClient({
    region: "ap-northeast-1",
  });
  const command = new GetUserCommand({
    AccessToken: accessToken,
  });
  const response = await client.send(command);
  if (response.UserMFASettingList) {
    return response.UserMFASettingList.includes("SOFTWARE_TOKEN_MFA");
  }
  return false;
}
