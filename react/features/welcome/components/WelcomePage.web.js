/* global interfaceConfig */

import React from 'react';
import styled from 'styled-components';

import { translate } from '../../base/i18n';
import { Watermarks } from '../../base/react';
import { connect } from '../../base/redux';
import { isMobileBrowser } from '../../base/environment/utils';
import { CalendarList } from '../../calendar-sync';
import { RecentList } from '../../recent-list';
import { SettingsButton, SETTINGS_TABS } from '../../settings';

import { AbstractWelcomePage, _mapStateToProps } from './AbstractWelcomePage';
import Tabs from './Tabs';

let Wrapper = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h1 {
        font-weight: 600;
        margin-bottom: 15px;
        font-size: 2rem;
        color: black!important;
    }

    p {
        font-size: 1.2rem;
        color: black!important;
    }

    .inner {
        margin: 0px auto;
        max-width: 720px;
        padding: 10px;
        text-align: center;
    }

    .logo {
        margin-bottom: 80px;
    }
`;

/**
 * The pattern used to validate room name.
 * @type {string}
 */
export const ROOM_NAME_VALIDATE_PATTERN_STR = '^[^?&:\u0022\u0027%#]+$';

/**
 * Maximum number of pixels corresponding to a mobile layout.
 * @type {number}
 */
const WINDOW_WIDTH_THRESHOLD = 425;

/**
 * The Web container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {
    /**
     * Default values for {@code WelcomePage} component's properties.
     *
     * @static
     */
    static defaultProps = {
        _room: ''
    };

    /**
     * Initializes a new WelcomePage instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            generateRoomnames:
                interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE,
            selectedTab: 0
        };

        /**
         * The HTML Element used as the container for additional content. Used
         * for directly appending the additional content template to the dom.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalContentRef = null;

        this._roomInputRef = null;

        /**
         * The HTML Element used as the container for additional toolbar content. Used
         * for directly appending the additional content template to the dom.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalToolbarContentRef = null;

        /**
         * The template to use as the main content for the welcome page. If
         * not found then only the welcome page head will display.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalContentTemplate = document.getElementById(
            'welcome-page-additional-content-template');

        /**
         * The template to use as the additional content for the welcome page header toolbar.
         * If not found then only the settings icon will be displayed.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalToolbarContentTemplate = document.getElementById(
            'settings-toolbar-additional-content-template'
        );

        // Bind event handlers so they are only bound once per instance.
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onRoomChange = this._onRoomChange.bind(this);
        this._setAdditionalContentRef
            = this._setAdditionalContentRef.bind(this);
        this._setRoomInputRef = this._setRoomInputRef.bind(this);
        this._setAdditionalToolbarContentRef
            = this._setAdditionalToolbarContentRef.bind(this);
        this._onTabSelected = this._onTabSelected.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();

        document.body.classList.add('welcome-page');
        document.title = interfaceConfig.APP_NAME;

        if (this.state.generateRoomnames) {
            this._updateRoomname();
        }

        if (this._shouldShowAdditionalContent()) {
            this._additionalContentRef.appendChild(
                this._additionalContentTemplate.content.cloneNode(true));
        }

        if (this._shouldShowAdditionalToolbarContent()) {
            this._additionalToolbarContentRef.appendChild(
                this._additionalToolbarContentTemplate.content.cloneNode(true)
            );
        }
    }

    /**
     * Removes the classname used for custom styling of the welcome page.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        super.componentWillUnmount();

        document.body.classList.remove('welcome-page');
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render() {
        const { t } = this.props;
        const { APP_NAME } = interfaceConfig;
        const showAdditionalContent = this._shouldShowAdditionalContent();
        const showAdditionalToolbarContent = this._shouldShowAdditionalToolbarContent();
        const showResponsiveText = this._shouldShowResponsiveText();

        return (
            <Wrapper>
                <div className="inner">
                    <div className="logo">
                        <svg width="100" height="100" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="13.5" y="13.5" width="473" height="473" fill="#FFB8B8" stroke="black" stroke-width="27"/>
                            <path d="M250 125C225.277 125 201.11 132.331 180.554 146.066C159.998 159.801 143.976 179.324 134.515 202.165C125.054 225.005 122.579 250.139 127.402 274.386C132.225 298.634 144.13 320.907 161.612 338.388C179.093 355.87 201.366 367.775 225.614 372.598C249.861 377.421 274.995 374.946 297.835 365.485C320.676 356.024 340.199 340.002 353.934 319.446C367.669 298.89 375 274.723 375 250C375 233.585 371.767 217.33 365.485 202.165C359.203 186.999 349.996 173.219 338.388 161.612C326.781 150.004 313.001 140.797 297.835 134.515C282.67 128.233 266.415 125 250 125ZM250 150C257.532 150.049 265.036 150.93 272.375 152.625C270.202 157.53 266.853 161.823 262.625 165.125C259.875 167.25 256.875 169 253.875 170.875C244.378 175.551 236.37 182.779 230.75 191.75C224.593 204.582 221.92 218.808 223 233C223 250 223 260 211.125 268.875C194 282.25 167.875 274.75 151.625 268C150.563 262.058 150.019 256.036 150 250C150 223.478 160.536 198.043 179.289 179.289C198.043 160.536 223.478 150 250 150ZM162.5 297.5C170.668 299.623 179.062 300.756 187.5 300.875C201.62 301.263 215.455 296.857 226.75 288.375C248.125 271.625 248.125 250.125 248.125 232.875C247.177 222.891 248.768 212.829 252.75 203.625C256.368 198.699 261.188 194.783 266.75 192.25C270.724 189.928 274.564 187.382 278.25 184.625C286.018 178.489 292.05 170.432 295.75 161.25C313.337 170.248 327.865 184.254 337.5 201.5C319.625 204 294.25 209.875 289.25 233.125C288.121 238.68 287.535 244.332 287.5 250C287.905 256.336 286.656 262.668 283.875 268.375L282.625 270.5C274.5 284 265.375 299.375 277.75 320.5C279.25 323.125 280.875 325.625 282.5 328.125C285.827 331.968 288.07 336.628 289 341.625C276.706 347.044 263.435 349.894 250 350C232.045 349.91 214.446 344.988 199.05 335.751C183.653 326.513 171.028 313.3 162.5 297.5ZM311.625 329C309.463 324.009 306.826 319.237 303.75 314.75C302.375 312.75 301 310.75 299.75 308.625C294.875 300.125 296.625 296.125 304.5 283.625L305.75 281.5C310.649 272.151 312.978 261.669 312.5 251.125C312.487 246.933 312.864 242.748 313.625 238.625C315.625 229.5 335 227 347 226.125C351.85 244.981 351.047 264.848 344.69 283.251C338.333 301.655 326.704 317.782 311.25 329.625L311.625 329Z" fill="black"/>
                        </svg>
                    </div>

                    <div className="main">
                        <h1>Welcome to the Varld Meeting Platform.</h1>
                        <p>Powered by <a href="https://jitsi.org">Jitsi Meet</a>. A big thank you to the Jitsi Community!</p>
                    </div>
                </div>
            </Wrapper>
        );
    }

    /**
     * Prevents submission of the form and delegates join logic.
     *
     * @param {Event} event - The HTML Event which details the form submission.
     * @private
     * @returns {void}
     */
    _onFormSubmit(event) {
        event.preventDefault();

        if (!this._roomInputRef || this._roomInputRef.reportValidity()) {
            this._onJoin();
        }
    }

    /**
     * Overrides the super to account for the differences in the argument types
     * provided by HTML and React Native text inputs.
     *
     * @inheritdoc
     * @override
     * @param {Event} event - The (HTML) Event which details the change such as
     * the EventTarget.
     * @protected
     */
    _onRoomChange(event) {
        super._onRoomChange(event.target.value);
    }

    /**
     * Callback invoked when the desired tab to display should be changed.
     *
     * @param {number} tabIndex - The index of the tab within the array of
     * displayed tabs.
     * @private
     * @returns {void}
     */
    _onTabSelected(tabIndex) {
        this.setState({ selectedTab: tabIndex });
    }

    /**
     * Renders tabs to show previous meetings and upcoming calendar events. The
     * tabs are purposefully hidden on mobile browsers.
     *
     * @returns {ReactElement|null}
     */
    _renderTabs() {
        if (isMobileBrowser()) {
            return null;
        }

        const { _calendarEnabled, _recentListEnabled, t } = this.props;

        const tabs = [];

        if (_calendarEnabled) {
            tabs.push({
                label: t('welcomepage.calendar'),
                content: <CalendarList />
            });
        }

        if (_recentListEnabled) {
            tabs.push({
                label: t('welcomepage.recentList'),
                content: <RecentList />
            });
        }

        if (tabs.length === 0) {
            return null;
        }

        return (
            <Tabs
                onSelect = { this._onTabSelected }
                selected = { this.state.selectedTab }
                tabs = { tabs } />);
    }

    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * welcome page content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the welcome page content.
     * @private
     * @returns {void}
     */
    _setAdditionalContentRef(el) {
        this._additionalContentRef = el;
    }

    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * toolbar additional content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the additional toolbar content.
     * @private
     * @returns {void}
     */
    _setAdditionalToolbarContentRef(el) {
        this._additionalToolbarContentRef = el;
    }

    /**
     * Sets the internal reference to the HTMLInputElement used to hold the
     * welcome page input room element.
     *
     * @param {HTMLInputElement} el - The HTMLElement for the input of the room name on the welcome page.
     * @private
     * @returns {void}
     */
    _setRoomInputRef(el) {
        this._roomInputRef = el;
    }

    /**
     * Returns whether or not additional content should be displayed below
     * the welcome page's header for entering a room name.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT
            && this._additionalContentTemplate
            && this._additionalContentTemplate.content
            && this._additionalContentTemplate.innerHTML.trim();
    }

    /**
     * Returns whether or not additional content should be displayed inside
     * the header toolbar.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalToolbarContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT
            && this._additionalToolbarContentTemplate
            && this._additionalToolbarContentTemplate.content
            && this._additionalToolbarContentTemplate.innerHTML.trim();
    }

    /**
     * Returns whether or not the screen has a size smaller than a custom margin
     * and therefore display different text in the go button.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowResponsiveText() {
        const { innerWidth } = window;

        return innerWidth <= WINDOW_WIDTH_THRESHOLD;
    }

}

export default translate(connect(_mapStateToProps)(WelcomePage));
