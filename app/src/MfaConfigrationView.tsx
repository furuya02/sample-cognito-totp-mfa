import { Box, Button, OutlinedInput, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import {
  AssociateSoftwareTokenCommand,
  CognitoIdentityProviderClient,
  SetUserMFAPreferenceCommand,
  SetUserMFAPreferenceCommandInput,
  VerifySoftwareTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import QRCode from "qrcode";
import { getAccessToken, getEmail, getIdToken } from "./util";
import { boxStyle } from "./const";

export default function MfaConfigrationView({
  handleSwitchConfiguring,
  setIsEnabledMFA,
}: {
  handleSwitchConfiguring: (sw: boolean) => void;
  setIsEnabledMFA: (sw: boolean) => void;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [secretCode, setSecretCode] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const idToken = await getIdToken();
      if (accessToken && idToken) {
        setAccessToken(accessToken.toString());
        try {
          const secretCode = await getSecret(accessToken.toString());
          setSecretCode(secretCode);

          const email = getEmail(idToken);
          const qrCodeUrl = await getQrCodeUrl(email, secretCode);
          setQrCodeUrl(qrCodeUrl);
        } catch (error) {
          console.log(`Failed to generate QRCode. error:${error}`);
        }
      }
    })();
  }, []);

  async function handleSave(): Promise<void> {
    try {
      // コードの検証
      const client = new CognitoIdentityProviderClient({
        region: "ap-northeast-1",
      });
      const input = {
        AccessToken: accessToken,
        UserCode: code,
        FriendlyDeviceName: "MyDevice",
      };
      const command = new VerifySoftwareTokenCommand(input);
      const response = await client.send(command);

      if (response.Status === "SUCCESS") {
        // MFA有効化設定
        const input: SetUserMFAPreferenceCommandInput = {
          SoftwareTokenMfaSettings: {
            Enabled: true,
            PreferredMfa: true,
          },
          AccessToken: accessToken,
        };
        const command = new SetUserMFAPreferenceCommand(input);
        const response = await client.send(command);
        if (response.$metadata.httpStatusCode === 200) {
          setIsEnabledMFA(true);
          handleSwitchConfiguring(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ ...boxStyle, border: "0px" }}>
      <Stack component="form" spacing={2}>
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            onClick={() => handleSwitchConfiguring(false)}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            disabled={code.length === 0}
            onClick={handleSave}
          >
            保存
          </Button>
        </Stack>
        <div>
          QRコードを使用してTOTPアプリを初期化してください。
          <Tooltip describeChild title={secretCode}>
            <Button>シークレットキーを表示</Button>
          </Tooltip>
        </div>
        <img src={qrCodeUrl} width={170} alt="QR Code" />
        <div>仮想アプリケーションのコードを以下で入力してください</div>
        <Stack width={200}>
          <OutlinedInput
            size="small"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

// QRコードを生成しそのURLを取得
async function getQrCodeUrl(
  email: string,
  secretCode: string
): Promise<string> {
  return await QRCode.toDataURL(
    `otpauth://totp/AWSCognito:${email}?secret=${secretCode}&issuer=AWSCognito`,
    {
      margin: 1,
      scale: 3.5,
    }
  );
}

// 認証情報からシークレットを取得
async function getSecret(accessToken: string): Promise<string> {
  const client = new CognitoIdentityProviderClient({
    region: "ap-northeast-1",
  });
  const command = new AssociateSoftwareTokenCommand({
    AccessToken: accessToken,
  });
  const response = await client.send(command);
  if (response.SecretCode) {
    return response.SecretCode;
  }
  return "";
}
