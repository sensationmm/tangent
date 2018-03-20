import PropTypes from 'prop-types';
import React, { Component } from 'react';
import StatBar from './StatBar';
import StatBarIndex from './StatBarIndex';
import { H2, P } from '/components/common/Type/Text';
import Popup from '/components/common/Popup';
import { bindAll } from '/util/utilities';
import FormattedMessage from '/components/common/i18n/FormattedMessage';

class MetricsSummary extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isMDFOpen: false,
        };

        bindAll([
            'togglePopup',
        ], this);

    }

    renderBars() {
        const { bars } = this.props;
        return bars.map((bar, index) => {
            return (
                <StatBarIndex key={`bar + ${index}`} {...bar} />
            );
        });
    }

    togglePopup(stateItem) {
        this.setState({
            ...this.state,
            [stateItem]: !this.state[stateItem]
        });
    }

    render() {
        const {summary} = this.props;
        const {isMDFOpen } = this.state;

        return (
            <div className="metric-box">
                <H2>{this.props.title}

                    <Popup togglePopup={() => this.togglePopup('isMDFOpen')} open={isMDFOpen} nobg>
                        <div className="popup__content">
                            <P>
                                <FormattedMessage id="SOGCategoryMDFPopup" />
                            </P>
                        </div>
                    </Popup>
                </H2>
                {this.renderBars()}

                <div className="metric-box__footer">
                    <StatBar {...summary} />
                </div>
            </div>
        );

    }

}

MetricsSummary.propTypes = {
    title: PropTypes.string.isRequired,
    bars: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        stat: PropTypes.number.isRequired,
        benchmark: PropTypes.number,
        style: PropTypes.string,
        size: PropTypes.string,
    })),
    summary: PropTypes.shape({
        label: PropTypes.string.isRequired,
        stat: PropTypes.number.isRequired,
        style: PropTypes.string,
        size: PropTypes.string,
    }),
};

export default MetricsSummary;
