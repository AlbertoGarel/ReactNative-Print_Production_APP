import {registerRootComponent} from 'expo';
import {Text, TextInput} from 'react-native';
import App from './App';

registerRootComponent(App);

//prevent font scaling.
Text.defaultProps = Text.defaultProps || {};
TextInput.defaultProps = Text.defaultProps || {};

Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;
