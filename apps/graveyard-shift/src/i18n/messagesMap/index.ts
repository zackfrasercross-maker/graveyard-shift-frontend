import { mergeMessagesMaps } from 'utils-shared/i18n';
import messagesMapUiPixi from 'components-ui-pixi/src/i18n/messagesMap';
import messagesMapUiHtml from 'components-ui-html/src/i18n/messagesMap';

import en from './en';
import zh from './zh';

const messagesMapGame = {
	en,
	zh,
};

const messagesMap = mergeMessagesMaps([messagesMapGame, messagesMapUiPixi, messagesMapUiHtml]);

export default messagesMap;
