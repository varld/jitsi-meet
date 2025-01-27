/* @flow */

import React, { Component } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { TooltipPrimitive } from '@atlaskit/tooltip/dist/cjs/styled';
import styled from 'styled-components';

import { translate } from '../../../i18n';
import { Icon } from '../../../icons';

const InlineDialog = styled(TooltipPrimitive)`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  max-height: 300px;
  max-width: 300px;
  padding: 8px 14px;
`;

/**
 * The type of the React {@code Component} props of {@link BaseIndicator}.
 */
type Props = {

    /**
     * Additional CSS class names to set on the icon container.
     */
    className: string,

    /**
     * The icon component to use.
     */
    icon: Object,

    /**
     * The CSS classnames to set on the icon element of the component.
    */
    iconClassName: string,

    /**
     * Id of the icon to be rendered.
     */
    iconId?: string,

    /**
     * The font size for the icon.
     */
    iconSize: string,

    /**
     * The ID attribue to set on the root element of the component.
     */
    id: string,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function,

    /**
     * The translation key to use for displaying a tooltip when hovering over
     * the component.
     */
    tooltipKey: string,

    /**
     * From which side of the indicator the tooltip should appear from,
     * defaulting to "top".
     */
    tooltipPosition: string
};

/**
 * React {@code Component} for showing an icon with a tooltip.
 *
 * @extends Component
 */
class BaseIndicator extends Component<Props> {
    /**
     * Default values for {@code BaseIndicator} component's properties.
     *
     * @static
     */
    static defaultProps = {
        className: '',
        id: '',
        tooltipPosition: 'top'
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            className,
            icon,
            iconClassName,
            iconId,
            iconSize,
            id,
            t,
            tooltipKey,
            tooltipPosition
        } = this.props;
        const iconContainerClassName = `indicator-icon-container ${className}`;
        const style = {};

        if (iconSize) {
            style.fontSize = iconSize;
        }

        return (
            <div className = 'indicator-container'>
                <Tooltip
                    content = { t(tooltipKey) }
                    position = { tooltipPosition }
                    component={ InlineDialog }
                >
                    <span
                        className = { iconContainerClassName }
                        id = { id }>
                        <Icon
                            className = { iconClassName }
                            id = { iconId }
                            src = { icon }
                            style = { style } />
                    </span>
                </Tooltip>
            </div>
        );
    }
}

export default translate(BaseIndicator);
