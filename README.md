
<h1 align="center">
  <br>
  <a href="https://albertogarel.github.io/printingAPP/"><img src="https://albertogarel.github.io/printingAPP/img/logo_printingAPP.png" alt="Markdownify" width="200"></a>
  <br>
  PrintingAPP
  <br>
  production manager
</h1>

<h4 align="center">Application based on the production needs of a journalistic company.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#how-to-use-this-work">Clone this work</a> •
  <a href="#custom-component-created">Custom components</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

<p align="center">
    <img src="https://albertogarel.github.io/printingAPP/img/phones_1.png" alt="mockup image"/>
</p>

## Key Features
<p id="key-features"></p>

* Tools for out of production calculations.
* Two types of productions:
    - Simple: No database support, production reporting, coil swapping, paper reels weight records or production self delete.
    - Complete or main: database, creation and sending of production reports, auto-add of paper reels in new productions, weight calculations by units and by complete production, warnings for lack of kilograms per unit, position exchanger of paper reels. paper and more..
* Application database:
    - Measurement coefficients for paper reels.
    - Paginations.
    - Paper weights.
    - Paper reels measurements.
    - Paper reels property.
    - Coefficients for calculating paper reel scraps.
    - Production lines.
    - Auto paster units.
    - Products.
    - Productions.
    - Papeer reels in productions.
* Creation and submission of production reports.
* Visualization of production statistics.
* Production report viewer within the app.
* Search for paper reels by scanning code or input text.
* Selection of barcode types to scan.
* Auto selection of auto pasters based on previous productions.
* Prediction of wastage of copies based on previous productions.
* Export and import databases of other users
* And more...

## How To Use
<p id="how-to-use"></p>

Consult documentation and use of the application once installed [Documentation and use](https://albertogarel.github.io/printingAPP/).

## Download
<p id="download"></p>

You can [download](https://albertogarel.github.io/printingAPP/) the latest installable version of Play Store.

## How to use this work?
<p id="how-to-use-this-work"></p>

###Requirements
To use Expo CLI, you need to have the following tools installed on your developer machine:

* Node.js LTS release
* Git
> **Note**
> * Watchman, required only for macOS or Linux users

### Expo install
First we install with npm explo-cli and exp (we must have **Node.js** and **npm** installed)

```shell
$ npm install -g expo-cli exp
```

#### Documentation:

> **Note:**
> You can check documentation [Expo Documentation](https://docs.expo.dev/get-started/installation/).
*******

### EAS Expo install (Expo Application Services)
Install the latest EAS CLI:

```shell
$ npm install -g eas-cli
```
*******

### Clone this repository

```shell
$ git clone https://github.com/AlbertoGarel/ReactNative-Print_Production_APP.git
```
*******

### Install dependencies
Go into the working directory 

```shell
$ npm install
```
*******

### Introduction of personalized requirements for the operation of the app
rename files

```shell
• app_custom.json TO app.json
• projectkeys_custom.js TO projectkeys.js
```
app.json changes:

```shell
{
  "expo": {
    ...,
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "YOUR ORGANIZATION REGISTRERED IN SENTRY",
            "project": "printing_app_production_manager",
            "authToken": "YOUR SENTRY TOKEN"
          }
        }
      ]
    }
  },
  "react-native-google-mobile-ads": {
    "android_app_id": "ca-app-pub-xxxxxxxx~xxxxxxxx",
    "ios_app_id": "ca-app-pub-xxxxxxxx~xxxxxxxx"
  }
}
  
```

projectkeys.js changes

```shell
export const ADMOB_KEYS = {
    "android_app_id": "ca-app-pub-xxxxxxxx~xxxxxxxx",
    "admod_SDK": "ca-app-pub-xxxxxxxx~xxxxxxxx"
};
```

or comment <code><span><</span>AdMobBanner<span>/></span></code> <code>Routes.js</code>
*******

### Creating preview build (Whit EAS)
#### Prerequisites

An Expo user account:
> **Note:**
> EAS Build is available to anyone with an Expo account, regardless of whether you pay for EAS or use free tier. You can sign up at [create your account](https://expo.dev/)


#### Log in to your Expo account
```shell
$ eas login
```
> You can check whether you are logged in by running <code>eas whoami</code>

#### Documentation:

> **Note:**<br>
> Developers using the Windows operating system must have WSL enabled. If you do not have it installed, follow this [installation guide](https://learn.microsoft.com/en-us/windows/wsl/install). When it prompts for choosing a Linux distribution, we recommend picking Ubuntu from the Windows Store. Launch Ubuntu at least once and then use an admin PowerShell to run the command:

```shell
$ Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```


#### Building APK for Android
On Linux WSL PowerShell go to project folder and run:

```shell
eas build -p android --profile preview --clear-cache
```

> **Note:**<br>
> Download the APK file from your [Expo account](https://expo.dev/login) on your Android device.

## Good job. Enjoy...!!

* [Don't forget to check the documentation and use of the application.](https://albertogarel.github.io/printingAPP/)
*******

## Personal component created
<p id="custom-component-created"><p/>

**RadioButtonComponent** 
- Multiple selection switch 

<p align="center">
  <img src="https://albertogarel.github.io/printingAPP/img/persnal_switch.jpg" alt="multiple select image"/>
</p>

**How work it:**
- Multiple selector for selection of auto pasters, discriminating whether they are whole or 1/2 paper reels in a production based on its configuration. It is able to auto select all if a production uses all the equipment included in a production line configured in the database.

* <code><span><</span>RadioButtonComponent<span>/></span>  <code>FormComponents</code> <code>Components</code>

## Credits
<p id="credits"><p/>

This software uses the following packages:

- [Expo](https://expo.dev)
- [@kichiyaki/react-native-barcode-generator](https://www.npmjs.com/package/@kichiyaki/react-native-barcode-generator)
- [@react-native-async-storage/async-storage](https://www.npmjs.com/package/@react-native-async-storage/async-storage)
- [React Native MaskedView](https://www.npmjs.com/package/@react-native-masked-view/masked-view) alert: change on package.json
- [@react-native-community/slider](https://www.npmjs.com/package/@react-native-community/slider)
- [@react-native-picker/picker](https://www.npmjs.com/package/@react-native-picker/picker)
- [@react-navigation/bottom-tabs](https://www.npmjs.com/package/@react-navigation/bottom-tabs)
- [@react-navigation/native](https://www.npmjs.com/package/@react-navigation/native)
- [@react-navigation/stack](https://www.npmjs.com/package/@react-navigation/stack)
- [Sentry SDK for React Native](https://www.npmjs.com/package/@sentry/react-native)
- [sentry-expo](https://www.npmjs.com/package/sentry-expo)
- [Formik](https://www.npmjs.com/package/formik)
- [JsBarcode](https://www.npmjs.com/package/jsbarcode)
- [react-native-barcode-mask](https://www.npmjs.com/package/react-native-barcode-mask)
- [react-native-chart-kit](https://www.npmjs.com/package/react-native-chart-kit)
- [react-native-drax](https://www.npmjs.com/package/react-native-drax)
- [react-native-easy-toast](https://www.npmjs.com/package/react-native-easy-toast)
- [react-native-gesture-handler](https://www.npmjs.com/package/react-native-gesture-handler)
- [react-native-google-mobile-ads](https://www.npmjs.com/package/react-native-google-mobile-ads)
- [React Native Modern Datepicker](https://www.npmjs.com/package/react-native-modern-datepicker)
- [react-native-pager-view](https://www.npmjs.com/package/react-native-pager-view)
- [react-native-raw-bottom-sheet](https://www.npmjs.com/package/react-native-raw-bottom-sheet)
- [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated)
- [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context)
- [react-native-screens](https://www.npmjs.com/package/react-native-screens)
- [react-native-snap-carousel](https://www.npmjs.com/package/react-native-snap-carousel)
- [react-native-switch-selector](https://www.npmjs.com/package/react-native-switch-selector)
- [react-native-table-component](https://www.npmjs.com/package/react-native-table-component)
- [React Native with V8 Runtime](https://www.npmjs.com/package/react-native-v8)
- [React Native for Web](https://www.npmjs.com/package/react-native-web) alert: check run
- [React Native WebView](https://www.npmjs.com/package/react-native-webview)
- [v8-android-jit](https://www.npmjs.com/package/v8-android-jit)
- [Yup](https://www.npmjs.com/package/yup)


## License
<p id="license"><p/>

GNU AGPLv3

---

> [albertogarel.com](https://www.albertogarel.com) &nbsp;&middot;&nbsp;
> GitHub [@albertogarel](https://github.com/albertogarel) &nbsp;&middot;&nbsp;
> Twitter [@albertogarel](https://twitter.com/albertogarel)

