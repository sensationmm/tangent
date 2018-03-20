import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Intl from '/util/Intl';

import StatBar from './StatBar';
import { H2 } from '/components/common/Type/Text';
import './metrics.scss';

class Metrics extends Component {

    constructor(props) {

        super(props);

    }

    renderBars() {
        const { bars } = this.props;
        return bars.map((bar, index) => {
            return (
                <StatBar key={`bar + ${index}`} {...bar} />
            );
        });
    }

    render() {

        return (

            <div className="metric-box">
                <H2>{this.props.title}</H2>
                {this.renderBars()}
                <div className="metric-box__footer">
                    <div className="metric-box__add-data" onClick={this.props.onAddData}>{Intl.key('ButtonUseOwnData')}</div>
                    <div className="metric-box__key">{Intl.key('SOGSitAnalysisCategoryMetricsBenchmarkLabel')}</div>
                </div>
            </div>

        );

    }

}

Metrics.propTypes = {
    title: PropTypes.string.isRequired,
    bars: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        stat: PropTypes.number.isRequired,
        benchmark: PropTypes.number,
        style: PropTypes.string,
        size: PropTypes.string,
    })),
    onAddData: PropTypes.func.isRequired
};

export default Metrics;
