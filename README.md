# sample-cognito-totp-mfa
Cognito Time-based One-time Password MFA Sample

## Setup

### Download

```
% git clone https://github.com/furuya02/sample-cognito-totp-mfa.git
% cd sample-cognito-totp-mfa
```


### CDK

* CDKでCognitoをセットアップします

```
% cd cdk
% npm install
% cdk deploy
Outputs:
CdkStack.CognitoClientId = xxxxxxxxxxxxxxxxxxxxxxxxx
CdkStack.CognitoPoolId = ap-northeast-1_xxxxxxxxx

% cd ..
```

* Output で出力された CognitoClientId 及び、CognitoPoolIdをコピーしておきます


### React

* sample-cognito-totp-mfa/app/src/aws-exports.jsを、コピーしたIdで編集する

```
const awsmobile = {
  aws_project_region: "ap-northeast-1",
  aws_cognito_region: "ap-northeast-1",
  aws_user_pools_id: "ap-northeast-1_xxxxxxxxx",
  aws_user_pools_web_client_id: "xxxxxxxxxxxxxxxxxxxxxxxxx",
};

export default awsmobile;
```
* ローカルでサーバを起動する
 
```
% cd app
% npm install
% npm start

Compiled successfully!

You can now view app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.1:3000

```

![](images/001.png)

## 使用方法





