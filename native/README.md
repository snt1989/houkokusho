# ストア公開用アプリ（iOS / Android）の作り方

Webアプリ（親フォルダの `index.html`）を、Capacitor で iPhone・Android のアプリに包みます。
アプリの中身はWebアプリと同じなので、機能を直したら `npm run sync` で両方に反映できます。

> ホーム画面に追加するだけでよければ、この手順は不要です（Webアプリ自体がPWA対応済み）。
> iPhone: Safari →「共有」→「ホーム画面に追加」／Android: Chrome →「アプリをインストール」

## 必要なもの

| | Android | iOS |
|---|---|---|
| パソコン | Windows / Mac / Linux | **Mac 必須** |
| ツール | Android Studio、Node.js | Xcode、Node.js |
| 公開用アカウント | Google Play Console（初回のみ約25ドル） | Apple Developer Program（年99ドル） |

## 初回の準備（1回だけ）

このフォルダ（`native/`）で実行します。Capacitor のバージョンは決め打ちしていないため、最新版が入ります。

```bash
cd native
npm install @capacitor/core @capacitor/android @capacitor/ios @capacitor/filesystem @capacitor/share
npm install -D @capacitor/cli
npm run prepare:www
npx cap add android      # Androidプロジェクトを生成
npx cap add ios          # iOSプロジェクトを生成（Macのみ）
```

`@capacitor/filesystem` と `@capacitor/share` は、PDF・写真の保存と共有に使います（アプリ内の「書き出す」「メールで送信」は、端末の共有画面を開く動きになります）。

## 開いて動かす

```bash
npm run sync            # Webアプリの最新版をコピーして反映
npm run open:android    # Android Studio が開く → ▶ で実機・エミュレータへ
npm run open:ios        # Xcode が開く → ▶ で実機・シミュレータへ（Macのみ）
```

## 公開前に決めること

- **アプリID**: `capacitor.config.json` の `appId`（初期値 `jp.sanohltd.houkokusho`）。ストアに出した後は変更できないので、最初のビルド前に決めてください。
- **アイコン・起動画面**: `@capacitor/assets` で、1024×1024 のアイコン画像から各サイズを自動生成できます。
- **アプリ名**: 端末に表示される名前は `appName`（初期値「写真報告書」）です。

## 注意

- **Appleの審査**: Webサイトを包んだだけのアプリは、審査で「機能が少ない」として却下されることがあります。端末への保存・共有・オフライン起動など、アプリならではの動作があることを説明できるようにしておくと通りやすくなります。
- **通信が必要**: データはFirebaseに保存します。また、PDF作成の部品とフォントはインターネットから読み込みます。完全なオフライン動作には、これらをアプリに同梱する追加の作業が必要です。
- **Firebase**: アプリからの通信は `localhost` 扱いで、Firebaseの承認済みドメインに初期状態で含まれています。通常は追加設定が不要です。
- **動作確認**: この土台は、実機・エミュレータでの動作確認をしていません。初回のビルド後に、写真の追加、PDF保存、メール送信を試してください。
