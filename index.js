import {registerRootComponent} from 'expo';
import {Text} from 'react-native';
import App from './App';

registerRootComponent(App);

//prevent font scaling.
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;