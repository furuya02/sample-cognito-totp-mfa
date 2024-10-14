# sample-cognito-totp-mfa
Cognito Time-based One-time Password MFA Sample

## セットアップ

### (1) Download

```
% git clone https://github.com/furuya02/sample-cognito-totp-mfa.git
% cd sample-cognito-totp-mfa
```


### (2) CDK

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


### (3) React

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

### (1) ユーザーの作成

* Cognitoのコンソールでユーザープールから「ユーザーを作成」を選択します

![](images/002.png)

* 「Eメールで招待を送信」「パスワードの生成」を選択して、ユーザーを作成します

![](images/003.png)

### (2) ユーザーのログイン（初回）

* ユーザーに招待メールが到着します

![](images/004.png)

* 招待メールに記載されたパスワードでログインします

![](images/005.png)

* ログイン後にパスワードの変更を行います

![](images/006.png)

* 続いて、メールの検証を行います

![](images/007.png)

![](images/008.png)
![](images/009.png)

* メールの検証が完了するとログインが完了します

![](images/010.png)

### (3) ユーザーのMFA設定

* 「MFAを設定する」をクリックします

![](images/011.png)

* 仮想MFAデバイスにシークレットを登録します

![](images/012.png)

* 仮想MFAデバイスで生成されたワンタイムパスワードを入力して「保存」をクリックします

![](images/013.png)

* 「現在、MFAは、アクティブになっています」と表示されたら登録完了です

![](images/014.png)

### (4) ユーザーのログイン（MFA設定後）

* いったん「ログアウト」してログインを確認してみます

![](images/015.png)

* メールアドレス及び、パスワードの認証が完了すると、ワンタイムパスワード入力に遷移します

![](images/016.png)

* 仮想MFAで生成されたパスワードを入力します

![](images/017.png)

* ログインに成功すると、「現在、MFAは、アクティブになっています」と表示されている事が確認できます

![](images/018.png)

