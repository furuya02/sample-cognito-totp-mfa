import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_cognito as cognito } from "aws-cdk-lib";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = "totp-mfa-sample";
    const domainPrefix = projectName;
    const endPoints = "http://localhost:3000/";

    const invitationMain = {
      emailBody: `<html><body><h1>${projectName}</h1><div><h3>Webサイトへ招待されました。 </h3><br>初回は、下記でログインが可能です。 <br>ユーザー名 : {username}<br>パスワード : {####} <br>URL: ${endPoints}</div><p><div>初回ログイン時に、パスワード変更及び。メール認証が必要です。また、早急にMFAの設定をお願いします。</div></body></html>`,
      emailSubject: `Webサイトへの招待 (${projectName})`,
    };
    const verificationMail = {
      emailBody: "<html><body>認証コードは、{####} です。</body></html>",
      emailSubject: `認証コード (${projectName})`,
    };

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: `${projectName}-pool`,
      selfSignUpEnabled: false, // ユーザー登録を管理者のみに制限
      signInAliases: {
        email: true,
      },
      standardAttributes: { email: { required: true } }, // メールアドレスを必須にする
      autoVerify: { email: true }, // メールアドレスの自動検証
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, // パスワードリセットの方法
      mfa: cognito.Mfa.OPTIONAL, // オプションのMFA
      mfaSecondFactor: {
        // MFAの設定 TOTPのみ
        sms: false,
        otp: true,
      },
      userInvitation: invitationMain,
      userVerification: verificationMail,
    });

    userPool.addDomain("userPoolDomain", {
      cognitoDomain: { domainPrefix: domainPrefix },
    });

    const appClient = userPool.addClient("userPoolClient", {
      userPoolClientName: `${projectName}-client`,
      generateSecret: false,
      oAuth: {
        flows: { authorizationCodeGrant: true }, // 認可コードグラントを使用
        scopes: [cognito.OAuthScope.OPENID],
      },
      enableTokenRevocation: false, // トークンの取り消しを無効にする
      preventUserExistenceErrors: true, // ユーザーの存在エラーを防ぐ
      authFlows: {
        // ユーザーSRP認証のみを許可
        userSrp: true, // ユーザーSRP認証
      },
    });

    // Client設定用にCognitoの情報を出力
    new cdk.CfnOutput(this, "CognitoPoolId", {
      description: "CognitoPoolId",
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "CognitoClientId", {
      description: "CognitoClientId",
      value: appClient.userPoolClientId,
    });
  }
}
